from fastapi import FastAPI, HTTPException, status, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from datetime import timedelta
import jwt

import models
from database import engine
from dependencies import get_current_user
from schemas import (
    UserCreate, UserResponse, TokenResponse,
    CategoryCreate, CategoryResponse, CategoryUpdate,
    ActivityCreate, ActivityResponse, ActivityUpdate,
    TrophyCreate, TrophyResponse, TrophyUpdate,
    StatsResponse,
)
from security import (
    hash_password,
    verify_password,
    ACCESS_TOKEN_MINUTES,
    create_access_token
)

from xp import *

app = FastAPI(title="Book of Life API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://book-of-life.jacobz314159.workers.dev",
    ],
    allow_credentials=False,
    allow_methods=["GET","POST","PATCH","DELETE","OPTIONS"],
    allow_headers=["Authorization","Content-Type"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post(
    "/users/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(user_data: UserCreate):
    new_user = models.User(
        email=str(user_data.email).strip().lower(),
        password_hash=hash_password(user_data.password),
    )

    with Session(engine) as session:
        session.add(new_user)

        try:
            session.commit()
            session.refresh(new_user)
        except IntegrityError:
            session.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email may already exist",
            )

        return new_user


@app.post("/users/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    email = form_data.username.strip().lower()

    with Session(engine) as session:
        user = session.scalar(
            select(models.User).where(models.User.email == email)
        )

        if user is None or not verify_password(
            form_data.password, user.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED1,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = create_access_token(user.id)

        return {
            "access_token": token,
            "token_type": "bearer",
        }

@app.get("/users/me", response_model=UserResponse)
def read_current_user(
    current_user: models.User = Depends(get_current_user),
):
    return current_user


@app.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    category_data: CategoryCreate,
    current_user: models.User = Depends(get_current_user),
):
    category = models.Category(
        user_id=current_user.id,
        name=category_data.name,
        multiplier=category_data.multiplier,
        color=category_data.color,
        active=category_data.active,
    )

    with Session(engine) as session:
        session.add(category)
        session.commit()
        session.refresh(category)

        return CategoryResponse.model_validate(category)


@app.get("/categories", response_model=list[CategoryResponse])
def list_categories(
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        statement = (
            select(models.Category)
            .where(models.Category.user_id == current_user.id)
            .order_by(models.Category.name)
        )

        categories = session.scalars(statement).all()

        return [
            CategoryResponse.model_validate(category)
            for category in categories
        ]



@app.patch("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    category_data: CategoryUpdate,
    current_user: models.User = Depends(get_current_user),
):
    updates = category_data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update",
        )

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Updated fields cannot be null",
        )

    with Session(engine) as session:
        category = session.scalar(
            select(models.Category).where(
                models.Category.id == category_id,
                models.Category.user_id == current_user.id,
            )
        )

        if category is None:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        for field, value in updates.items():
            setattr(category, field, value)

        session.commit()
        session.refresh(category)

        return CategoryResponse.model_validate(category)



@app.delete("/categories/{category_id}", response_model=CategoryResponse)
def delete_category(
    category_id: str,
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        category = session.scalar(
            select(models.Category).where(
                models.Category.id == category_id,
                models.Category.user_id == current_user.id,
            )
        )

        if category is None:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        category.active = False
        session.commit()
        session.refresh(category)

        return CategoryResponse.model_validate(category)


@app.post(
    "/activities",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_activity(
    activity_data: ActivityCreate,
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        category = session.scalar(
            select(models.Category).where(
                models.Category.id == activity_data.category_id,
                models.Category.user_id == current_user.id,
            )
        )

        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

        if not category.active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot log an activity to an inactive category",
            )
        
        total_activity_xp = session.scalar(
            select(func.coalesce(func.sum(models.Activity.xp_earned), 0)).where(
                models.Activity.user_id == current_user.id
            )
        )

        total_trophy_xp = session.scalar(
            select(func.coalesce(func.sum(models.Trophy.xp_reward), 0)).where(
                models.Trophy.user_id == current_user.id
            )
        )

        total_xp = total_activity_xp + total_trophy_xp
        current_level = calculate_level(total_xp)

        earned_xp = calculate_activity_xp(
            duration=activity_data.duration,
            category_multiplier=category.multiplier,
            current_level=current_level,
        )

        activity = models.Activity(
            user_id=current_user.id,
            category_id=category.id,
            activity_date=activity_data.activity_date,
            duration=activity_data.duration,
            xp_earned=earned_xp,
        )

        session.add(activity)
        session.commit()
        session.refresh(activity)

        return ActivityResponse.model_validate(activity)


@app.get("/activities", response_model=list[ActivityResponse])
def list_activities(
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        statement = (
            select(models.Activity)
            .where(models.Activity.user_id == current_user.id)
            .order_by(models.Activity.activity_date.desc(), models.Activity.id.desc())
        )

        activities = session.scalars(statement).all()

        return [
            ActivityResponse.model_validate(activity)
            for activity in activities
        ]


@app.patch("/activities/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: str,
    activity_data: ActivityUpdate,
    current_user: models.User = Depends(get_current_user),
):
    updates = activity_data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update",
        )

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Updated fields cannot be null",
        )

    with Session(engine) as session:
        activity = session.scalar(
            select(models.Activity).where(
                models.Activity.id == activity_id,
                models.Activity.user_id == current_user.id,
            )
        )

        if activity is None:
            raise HTTPException(
                status_code=404,
                detail="Activity not found",
            )

        category = activity.category

        if "category_id" in updates:
            category = session.get(models.Category, updates["category_id"])

            if (
                category is None
                or category.user_id != current_user.id
                or not category.active
            ):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid or inactive category",
                )

            activity.category_id = category.id

        if "activity_date" in updates:
            activity.activity_date = updates["activity_date"]

        if "duration" in updates:
            activity.duration = updates["duration"]

        # Recalculate XP only if category or duration changed.
        if "category_id" in updates or "duration" in updates:
            activity_xp = session.scalar(
                select(func.coalesce(func.sum(models.Activity.xp_earned), 0))
                .where(
                    models.Activity.user_id == current_user.id,
                    models.Activity.id != activity.id,
                )
            )

            trophy_xp = session.scalar(
                select(func.coalesce(func.sum(models.Trophy.xp_reward), 0))
                .where(models.Trophy.user_id == current_user.id)
            )

            total_xp = activity_xp + trophy_xp
            current_level = calculate_level(total_xp)

            activity.xp_earned = calculate_activity_xp(
                duration=activity.duration,
                category_multiplier=category.multiplier,
                current_level=current_level,
            )

        session.commit()
        session.refresh(activity)

        return ActivityResponse.model_validate(activity)


@app.delete(
    "/activities/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_activity(
    activity_id: str,
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        activity = session.scalar(
            select(models.Activity).where(
                models.Activity.id == activity_id,
                models.Activity.user_id == current_user.id,
            )
        )

        if activity is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity not found",
            )

        session.delete(activity)
        session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post(
    "/trophies",
    response_model=TrophyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_trophy(
    trophy_data: TrophyCreate,
    current_user: models.User = Depends(get_current_user),
):
    trophy = models.Trophy(
        user_id=current_user.id,
        title=trophy_data.title,
        description=trophy_data.description,
        trophy_date=trophy_data.trophy_date,
        xp_reward=trophy_data.xp_reward,
    )

    with Session(engine) as session:
        session.add(trophy)
        session.commit()
        session.refresh(trophy)

        return TrophyResponse.model_validate(trophy)


@app.get("/trophies", response_model=list[TrophyResponse])
def list_trophies(
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        statement = (
            select(models.Trophy)
            .where(models.Trophy.user_id == current_user.id)
            .order_by(models.Trophy.trophy_date.desc())
        )

        trophies = session.scalars(statement).all()

        return [
            TrophyResponse.model_validate(trophy)
            for trophy in trophies
        ]


@app.patch("/trophies/{trophy_id}", response_model=TrophyResponse)
def update_trophy(
    trophy_id: str,
    trophy_data: TrophyUpdate,
    current_user: models.User = Depends(get_current_user),
):
    updates = trophy_data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="Provide at least one field to update",
        )

    if any(value is None for value in updates.values()):
        raise HTTPException(
            status_code=422,
            detail="Updated fields cannot be null",
        )

    with Session(engine) as session:
        trophy = session.scalar(
            select(models.Trophy).where(
                models.Trophy.id == trophy_id,
                models.Trophy.user_id == current_user.id,
            )
        )

        if trophy is None:
            raise HTTPException(
                status_code=404,
                detail="Trophy not found",
            )

        for field, value in updates.items():
            setattr(trophy, field, value)

        session.commit()
        session.refresh(trophy)

        return TrophyResponse.model_validate(trophy)
    

@app.delete(
    "/trophies/{trophy_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_trophy(
    trophy_id: str,
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        trophy = session.scalar(
            select(models.Trophy).where(
                models.Trophy.id == trophy_id,
                models.Trophy.user_id == current_user.id,
            )
        )

        if trophy is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trophy not found",
            )

        session.delete(trophy)
        session.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/stats", response_model=StatsResponse)
def get_stats(
    current_user: models.User = Depends(get_current_user),
):
    with Session(engine) as session:
        activity_xp = session.scalar(
            select(func.coalesce(func.sum(models.Activity.xp_earned), 0))
            .where(models.Activity.user_id == current_user.id)
        )

        trophy_xp = session.scalar(
            select(func.coalesce(func.sum(models.Trophy.xp_reward), 0))
            .where(models.Trophy.user_id == current_user.id)
        )

        total_xp = activity_xp + trophy_xp
        level = calculate_level(total_xp)

        xp_into_level = total_xp - cumulative_xp_for_level(level)
        xp_required = xp_for_level(level + 1)

        return StatsResponse(
            total_activity_xp=activity_xp,
            total_trophy_xp=trophy_xp,
            total_xp=total_xp,
            level=level,
            xp_into_level=xp_into_level,
            xp_for_next_level=xp_required,
            progress_percentage=xp_into_level / xp_required * 100,
        )
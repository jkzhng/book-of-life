from datetime import date
from pydantic import BaseModel, Field, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: str
    email: EmailStr

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    multiplier: float = Field(gt=0)
    color: str = Field(min_length=1, max_length=30)
    active: bool = True


class CategoryResponse(BaseModel):
    id: str
    name: str
    multiplier: float
    color: str
    active: bool

    model_config = {"from_attributes": True}


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    multiplier: float | None = Field(default=None, gt=0)
    color: str | None = Field(default=None, min_length=1, max_length=30)
    active: bool | None = None


class ActivityCreate(BaseModel):
    category_id: str
    activity_date: date
    duration: int = Field(gt=0)


class ActivityResponse(BaseModel):
    id: str
    category_id: str
    activity_date: date
    duration: int
    xp_earned: float

    model_config = {"from_attributes": True}


class ActivityUpdate(BaseModel):
    category_id: str | None = None
    activity_date: date | None = None
    duration: int | None = Field(default=None, gt=0)


class TrophyCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(max_length=5000)
    trophy_date: date
    xp_reward: int = Field(ge=0)


class TrophyResponse(BaseModel):
    id: str
    title: str
    description: str
    trophy_date: date
    xp_reward: int

    model_config = {"from_attributes": True}


class TrophyUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    trophy_date: date | None = None
    xp_reward: int | None = Field(default=None, ge=0)


class StatsResponse(BaseModel):
    total_activity_xp: float
    total_trophy_xp: int
    total_xp: float
    level: int
    xp_into_level: float
    xp_for_next_level: int
    progress_percentage: float
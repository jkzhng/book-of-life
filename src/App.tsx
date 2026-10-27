import './App.css'

import { useEffect, useState } from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';

import { getCurrentUser, type User } from './api/users';
import { getCategories, createCategory, updateCategory } from './api/categories';
import { getActivities, createActivity, deleteActivity } from './api/activities';
import { getTrophies, createTrophy, deleteTrophy } from './api/trophy';
import { getStats, type Stats } from './api/stats';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import StatsPage from './pages/StatsPage';
import Trophies from './pages/Trophies';

import { calculateTotalXP } from './logic/xp';

import type { Activity, NewActivity } from './types/activity';
import type { Category } from './types/category';
import type { Trophy } from './types/trophy';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [backendStats, setBackendStats] = useState<Stats | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const totalXP = backendStats?.total_xp ?? calculateTotalXP(activities, trophies);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    getCurrentUser(token)
      .then((curentUser) => {
        if(!cancelled) {
          setUser(curentUser);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setToken(null);
          setUser(null);
          setError(
            err instanceof Error 
              ? err.message
              : "Unable to verify your session.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    getCategories(token)
      .then((apiCategories) => {
        if (!cancelled) {
          setCategories(apiCategories);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error('Failed to load categories:', err);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getActivities(token)
      .then((apiActivities) => {
        if (cancelled) return;

        setActivities(
          apiActivities.map((activity) => ({
            id: activity.id,
            categoryId: activity.category_id,
            date: activity.activity_date,
            duration: activity.duration,
            xpEarned: activity.xp_earned,
          }))
        );
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error('Failed to load activities:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getTrophies(token)
      .then((apiTrophies) => {
        if (cancelled) return;

        setTrophies(
          apiTrophies.map((trophy) => ({
            id: trophy.id,
            title: trophy.title,
            description: trophy.description,
            date: trophy.trophy_date,
            xpReward: trophy.xp_reward,
          }))
        );
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error('Failed to load trophies:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getStats(token)
      .then((stats) => {
        if (!cancelled) {
          setBackendStats(stats);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error('Failed to load stats:', error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, activities, trophies]);

  useEffect(() => {
    function handleUnauthorized() {
      setToken(null);
      setUser(null);
      setBackendStats(null);
      setActivities([]);
      setCategories([]);
      setTrophies([]);
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener(
        "auth:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  function handleLogout() {
    setToken(null);
    setUser(null);
    setBackendStats(null);
    setActivities([]);
    setCategories([]);
    setTrophies([]);
  }

  async function addActivity(activity: NewActivity) {
    if (!token) return;

    try {
      const savedActivity = await createActivity(token, {
        category_id: activity.categoryId,
        activity_date: activity.date,
        duration: activity.duration,
      });

      setActivities((previousActivities) => [
        {
          id: savedActivity.id,
          categoryId: savedActivity.category_id,
          date: savedActivity.activity_date,
          duration: savedActivity.duration,
          xpEarned: savedActivity.xp_earned,
        },
        ...previousActivities,
      ]);
    } catch (error) {
      console.error('Failed to create activity:', error);
      alert('Failed to save activity. Please try again.');
    }
  }

  async function handleDeleteActivity(activityId: string) {
    if (!token) return;

    try {
      await deleteActivity(token, activityId);

      setActivities((previousActivities) =>
        previousActivities.filter((activity) => activity.id !== activityId)
      );
    } catch (error) {
      console.error('Failed to delete activity:', error);
      alert('Failed to delete activity. Please try again.');
    }
  }

  async function addCategory(category: Category) {
    if (!token) return;

    try{
      const savedCategory = await createCategory(token, {
        name: category.name,
        multiplier: category.multiplier,
        color: category.color,
        active: category.active,
      });

      setCategories((previousCategories) => [
        ...previousCategories,savedCategory,
      ]);
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to save category. Please try again.');
    }
  }

  async function editCategory(updatedCategory: Category) {
    if (!token) return;

    try {
      const savedCategory = await updateCategory(token, updatedCategory.id, {
        name: updatedCategory.name,
        multiplier: updatedCategory.multiplier,
        color: updatedCategory.color,
        active: updatedCategory.active,
      });

      setCategories((prev) =>
        prev.map((category) =>
          category.id === savedCategory.id ? savedCategory : category
        )
      );
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category. Please try again.');
    }
  }

  async function addTrophy(trophy: Trophy) {
    if (!token) return;

    try {
      const savedTrophy = await createTrophy(token, {
        title: trophy.title,
        description: trophy.description,
        trophy_date: trophy.date,
        xp_reward: trophy.xpReward,
      });

      setTrophies((previousTrophies) => [
        {
          id: savedTrophy.id,
          title: savedTrophy.title,
          description: savedTrophy.description,
          date: savedTrophy.trophy_date,
          xpReward: savedTrophy.xp_reward,
        },
        ...previousTrophies,
      ]);
    } catch (error) {
      console.error('Failed to create trophy:', error);
      alert('Failed to save trophy. Please try again.');
    }
  }


  
  async function handleDeleteTrophy(trophyId: string) {
    if (!token) return;

    try {
      await deleteTrophy(token, trophyId);

      setTrophies((previousTrophies) =>
        previousTrophies.filter((trophy) => trophy.id !== trophyId)
      );
    } catch (error) {
      console.error('Failed to delete trophy:', error);
      alert('Failed to delete trophy. Please try again.');
    }
  }


  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsActivityFormOpen(false);
        setIsCategoryManagerOpen(false);
      }
    }
      
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!token) {
    return (
      <>
        {error && <p role="alert">{error}</p>}
        <LoginPage onLoginSuccess={setToken} />
      </>
    )
  }

  if (loading || !user) {
    return <p>Loading your account...</p>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <div>
          <header className="app-header">
            <Link to="/" className="app-logo">Book of Life</Link>
            <button className="button button-danger" onClick={handleLogout}>logout</button>
          </header>
        </div>

        <main>

          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  activities={activities}
                  categories={categories}
                  totalXP={totalXP}

                  isActivityFormOpen={isActivityFormOpen}
                  isCategoryManagerOpen={isCategoryManagerOpen}

                  onAddActivity={addActivity}
                  onDeleteActivity={handleDeleteActivity}

                  onAddCategory={addCategory}
                  onEditCategory={editCategory}

                  onOpenActivityForm={() => setIsActivityFormOpen(true)}
                  onCloseActivityForm={() => setIsActivityFormOpen(false)}

                  onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
                  onCloseCategoryManager={() => setIsCategoryManagerOpen(false)}

                />
              }
            />

            <Route
              path="/activities"
              element={
                <Activities
                  activities={activities}
                  categories={categories}
                  onDeleteActivity={handleDeleteActivity}
                />
              }
            />

            <Route
              path="/stats"
              element={
                <StatsPage
                  activities={activities}
                  categories={categories}
                  trophies={trophies}
                />
              }
            />

            <Route
              path="/trophies"
              element={
                <Trophies
                  trophies={trophies}
                  onAddTrophy={addTrophy}
                  onDeleteTrophy={handleDeleteTrophy}
                />
              }
            />
          </Routes>
        </main>

        
      </div>
    </BrowserRouter>
  )
}

export default App

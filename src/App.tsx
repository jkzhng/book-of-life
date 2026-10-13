import './App.css'

import { useEffect, useState } from 'react';
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import StatsPage from './pages/StatsPage';
import Trophies from './pages/Trophies';

import { calculateActivityXP, calculateTotalXP, calculateLevel } from './logic/xp';

import type { Activity, NewActivity } from './types/activity';
import type { Category } from './types/category';
import type { Trophy } from './types/trophy';

const testActivities: Activity[] = [
  {
    id: '2',
    categoryId: 'Piano',
    date: '2026-09-08',
    duration: 600,
    xpEarned: 600,
  },
  {
    id: '1',
    categoryId: 'Programming',
    date: '2026-09-08',
    duration: 600,
    xpEarned: 600,
  },
];

const testCategories: Category[] = [
  {
    id: crypto.randomUUID(),
    name: 'Piano',
    multiplier: 1.5,
    active: true,
    color: '#8b5cf6',
  },
  {
    id: crypto.randomUUID(),
    name: 'Programming',
    multiplier: 2,
    active: true,
    color: '#8b5cf6',
  },
  {
    id: crypto.randomUUID(),
    name: 'Basketball',
    multiplier: 1.2,
    active: true,
    color: '#8b5cf6',
  }
]

const testTrophies: Trophy[] = [
  {
    id: crypto.randomUUID(),
    title: 'Book of Life',
    description: "Began my journal",
    date: '2026-09-26',
    xpReward: 1,
  }
]

function loadActivitiesFromLocalStorage(): Activity[] {
  const savedActivities = localStorage.getItem('activities');
  if (savedActivities) {
    return JSON.parse(savedActivities);
  }
  return testActivities;
}

function loadCategoriesFromLocalStorage(): Category[] {
  const savedCategories = localStorage.getItem('categories');
  if (savedCategories) {
    return JSON.parse(savedCategories);
  }
  return testCategories;
}

function loadTrophiesFromLocalStorage(): Trophy[] {
  const savedTrophies = localStorage.getItem('trophies');
  if (savedTrophies) {
    return JSON.parse(savedTrophies);
  }
  return testTrophies;
}

function App() {
  const [activities, setActivities] = useState<Activity[]>(loadActivitiesFromLocalStorage);
  const [categories, setCategories] = useState<Category[]>(loadCategoriesFromLocalStorage);
  const [trophies, setTrophies] = useState<Trophy[]>(loadTrophiesFromLocalStorage);
  const [isActivityFormOpen, setIsActivityFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const totalXP = calculateTotalXP(activities, trophies);
  const currentLevel = calculateLevel(totalXP);


  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('trophies', JSON.stringify(trophies));
  }, [trophies]);

  function addActivity(activity: NewActivity) {
    const xpEarned = calculateActivityXP(activity, categories,currentLevel);
    
    const newActivity = {
      ...activity,
      id: crypto.randomUUID(),
      xpEarned,
    };

    setActivities((prevActivities) => [newActivity, ...prevActivities]);
  }

  function deleteActivity(id: string) {
    setActivities((prevActivities) => prevActivities.filter((activity) => activity.id !== id));
  }

  function addCategory(category: Category) {
    setCategories((prevCategories) => [...prevCategories, category]);
  }

  function editCategory(updatedCategory: Category) {
    setCategories(prev => prev.map(category => category.id === updatedCategory.id ? updatedCategory : category));
  }

  function addTrophy(trophy: Trophy) {
    const newTrophy = {
      ...trophy,
      id: crypto.randomUUID(),
    };

    setTrophies((prevTrophies) => [newTrophy, ...prevTrophies]);
  }

  function deleteTrophy(id: string) {
    setTrophies((prevTrophies) => prevTrophies.filter((trophy) => trophy.id !== id));
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

  return (
    <BrowserRouter>
      <div className="app">
        <div>
          <header className="app-header">
            <Link to="/" className="app-logo">Book of Life</Link>
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
                  onDeleteActivity={deleteActivity}

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
                  onDeleteActivity={deleteActivity}
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
                  onDeleteTrophy={deleteTrophy}
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

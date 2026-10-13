# Book of Life

Book of Life is a personal activity-tracking app that gamifies how you spend your time. Log activities, earn XP, level up, track your stats, and record accomplishments in your Trophy Case.

## Features

- **Activity Tracking:** Log activities by category, date, and duration.
- **Categories:** Create and manage activity categories with custom XP multipliers and colors.
- **Experience Points (XP):** Earn XP for completed activities and trophy accomplishments.
- **Leveling System:** Gain levels as you accumulate XP.
- **Statistics:** Review activity time and XP through the Stats page.
- **Trophy Case:** Create accomplishments, assign XP rewards, and keep track of achievements.
- **Local Storage:** Your data is saved in your browser.

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/) (includes npm)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zhan4534/book-of-life.git
   ```

2. Navigate to the project directory:

   ```bash
   cd book-of-life
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## How to Use

1. **Log activities:** Add an activity by selecting a category, date, and duration.
2. **Manage categories:** Create categories and customize their XP multipliers and colors.
3. **Earn XP and level up:** Accumulate XP through logged activities and trophy rewards.
4. **Review statistics:** Visit the Stats page to see your activity and XP progress.
5. **Create trophies:** Open the Trophy Case to record accomplishments and assign XP rewards.

## Data Storage

Activity, category, and trophy data are stored in your browser's local storage. Data is not automatically synchronized between browsers or devices. Clearing browser storage may delete your saved data.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- CSS
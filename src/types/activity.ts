interface Activity {
    id: string;
    categoryId: string;
    date: string;
    duration: number;
    xpEarned: number;
}

interface NewActivity {
    categoryId: string;
    date: string;
    duration: number;
}

export type { Activity, NewActivity };
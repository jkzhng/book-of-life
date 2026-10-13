function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hoursStr = hours > 0 ? `${hours}h ` : '';
    const minsStr = mins > 0 ? `${mins}m ` : '';
    const secsStr = secs > 0 ? `${secs}s` : '';

    return `${hoursStr}${minsStr}${secsStr}`;
}

export { formatDuration };
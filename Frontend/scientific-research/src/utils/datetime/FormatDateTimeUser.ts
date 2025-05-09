export default function formatDateTimeUser(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const theDayOfWeeks: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${theDayOfWeeks[date.getDay()]} | ${day}/${month}/${year}`;
}
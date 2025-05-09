// Define the function to calculate the time difference
export default function calculateTimeDifference(postedAtString: string): string {
    // Convert the postedAtString to a Date object
    const postedAt: Date = new Date(postedAtString);

    // Get the current time
    const currentTime: Date = new Date();

    // Calculate the difference in milliseconds
    const differenceInMillis: number = currentTime.getTime() - postedAt.getTime();

    // Convert milliseconds to seconds
    const differenceInSeconds: number = Math.floor(differenceInMillis / 1000);

    // Convert seconds to minutes
    const differenceInMinutes: number = Math.floor(differenceInSeconds / 60);

    // If less than 1 hour, return in minutes
    if (differenceInMinutes < 60) {
        return `${differenceInMinutes} minutes ago`;
    }

    // Convert minutes to hours
    const differenceInHours: number = Math.floor(differenceInMinutes / 60);

    // If less than 24 hours, return in hours
    if (differenceInHours < 24) {
        return `${differenceInHours} hours ago`;
    }

    // Convert hours to days
    const differenceInDays: number = Math.floor(differenceInHours / 24);

    // Return in days
    return `${differenceInDays} days ago`;
}
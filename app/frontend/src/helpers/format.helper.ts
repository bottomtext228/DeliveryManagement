export function formatHours(hours: number): string {
    const absHours = Math.abs(hours);
    const lastDigit = absHours % 10;
    const lastTwoDigits = absHours % 100;

    let suffix = "часов";

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        suffix = "часов";
    } else if (lastDigit === 1) {
        suffix = "час";
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        suffix = "часа";
    }

    return `${hours} ${suffix}`;
}
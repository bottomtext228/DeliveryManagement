import { OrderStatus } from "../types/types";

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

export function formatOrderStatus(status: OrderStatus) {
    switch (status) {
        case OrderStatus.Pending:
            return 'Ожидание'
        case OrderStatus.Processing:
            return 'В обработке'
        case OrderStatus.Shipped:
            return 'В пути'
        case OrderStatus.Delivered:
            return 'Доставлен'
        case OrderStatus.Cancelled:
            return 'Отменён'
        case OrderStatus.Returned:
            return 'Возврат'
    }
}
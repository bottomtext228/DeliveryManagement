export const groupBy = (arr: any[], callback: (currentValue: any, currentIndex: number, array: any[]) => any) => {
    return arr.reduce((acc = {}, ...args) => {
        const key = callback(...args);
        acc[key] ??= []
        acc[key].push(args[0]);
        return acc;
    }, {});
};
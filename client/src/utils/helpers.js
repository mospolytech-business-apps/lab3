export const sortIngredientsOrDecorationsInDaysGroup = (ingredientsOrDecorations) => {
    const result = {};
    let currentDateGroup;
    for (const el of ingredientsOrDecorations) {
        if (!currentDateGroup) {
            currentDateGroup = new Date(el.expirationDate);
            result[currentDateGroup.toLocaleDateString()] = [el];
        } else {
            const elementExpirationDate = new Date(el.expirationDate);
            const dateDiff = Math.ceil((elementExpirationDate - currentDateGroup) / (1000 * 60 * 60 * 24));

            if ((dateDiff <= 3 && !result[elementExpirationDate.toLocaleDateString()]) || (dateDiff > 3)) {
                    currentDateGroup = elementExpirationDate;
                    result[currentDateGroup.toLocaleDateString()] = [el];
            } else {
                result[currentDateGroup.toLocaleDateString()].push(el);
            }
        }
    }

    return result;
}

export const addDaysToDate = (date, daysCount) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + daysCount);
    return currentDate.toLocaleDateString();
}
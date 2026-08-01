export const getNextTrainItem = <T extends { Word: string }>(
    items: readonly T[],
    currentWord: string | null,
): T | null => {
    if (items.length === 0) {
        return null;
    }

    const alternativeItems = currentWord
        ? items.filter((item) => item.Word !== currentWord)
        : items;
    const candidates = alternativeItems.length > 0 ? alternativeItems : items;
    const randomIndex = Math.floor(Math.random() * candidates.length);

    return candidates[randomIndex] ?? candidates[0] ?? null;
};

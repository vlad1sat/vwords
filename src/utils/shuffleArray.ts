export const shuffleArray = <T>(array: T[]): T[] =>
    structuredClone(array).sort(() => Math.random() - 0.5);

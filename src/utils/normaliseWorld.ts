export const normaliseWorld = (world: string) => world.trim().replace(/\s+/g, '').toLowerCase();

export const getWorldEditDistance = (firstWorld: string, secondWorld: string): number => {
    const first = normaliseWorld(firstWorld);
    const second = normaliseWorld(secondWorld);
    const distances = Array.from({ length: first.length + 1 }, () =>
        Array<number>(second.length + 1).fill(0),
    );

    for (let firstIndex = 0; firstIndex <= first.length; firstIndex += 1) {
        distances[firstIndex]![0] = firstIndex;
    }

    for (let secondIndex = 0; secondIndex <= second.length; secondIndex += 1) {
        distances[0]![secondIndex] = secondIndex;
    }

    for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
        for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
            const substitutionCost = first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1;

            distances[firstIndex]![secondIndex] = Math.min(
                distances[firstIndex - 1]![secondIndex]! + 1,
                distances[firstIndex]![secondIndex - 1]! + 1,
                distances[firstIndex - 1]![secondIndex - 1]! + substitutionCost,
            );

            const isTransposition =
                firstIndex > 1 &&
                secondIndex > 1 &&
                first[firstIndex - 1] === second[secondIndex - 2] &&
                first[firstIndex - 2] === second[secondIndex - 1];

            if (isTransposition) {
                distances[firstIndex]![secondIndex] = Math.min(
                    distances[firstIndex]![secondIndex]!,
                    distances[firstIndex - 2]![secondIndex - 2]! + 1,
                );
            }
        }
    }

    return distances[first.length]![second.length]!;
};

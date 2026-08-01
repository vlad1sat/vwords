import type { CheckStateInfo } from '@/services/checkStateService.ts';

export enum TrainType {
    ForeignWorld = 'foreignWorld',
    NationalWorld = 'nationalWorld',
}

export const getTrainType = (): TrainType =>
    Math.random() > 0.5 ? TrainType.ForeignWorld : TrainType.NationalWorld;

export const getBackTrainValue = (train: TrainType): keyof CheckStateInfo['Stat'][0] =>
    new Map<TrainType, keyof CheckStateInfo['Stat'][0]>([
        [TrainType.ForeignWorld, 'TranslateCheckCount'],
        [TrainType.NationalWorld, 'WordCheckCount'],
    ]).get(train)!;

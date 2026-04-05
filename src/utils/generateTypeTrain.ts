export enum TrainType {
    ForeignWorld = 'foreignWorld',
    NationalWorld = 'nationalWorld',
}

export const getTrainType = (): TrainType =>
    Math.random() > 0.5 ? TrainType.ForeignWorld : TrainType.NationalWorld;

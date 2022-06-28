import { IStrategy } from './Strategy';

export interface IWorker<StrategyTypes> {
    doWork(): void;
    addWork(strategy: IStrategy<StrategyTypes>): void;
}

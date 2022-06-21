import { IStrategy } from './Strategy';

export interface IWorker<T> {
    doWork(): void;
    addWork(strategy: IStrategy<T>): void;
}

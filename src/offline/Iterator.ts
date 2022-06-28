import { StrategyTypes } from './Strategy';

export interface Iterator<StrategyTypes> {
    // Return the current element.
    current(): StrategyTypes;
    // Return the current element and move forward to next element.
    next(): StrategyTypes;
    // Return the key of the current element.
    key(): number;
    // Checks if current position is valid.
    valid(): boolean;
    // Rewind the Iterator to the first element.
    rewind(): void;
}

interface Aggregator {
    // Retrieve an external iterator.
    getIterator(): Iterator<string>;
}

class BottomTopItegrator implements Iterator<StrategyTypes> {
    private strategies: Array<StrategyTypes> = [];
    current(): StrategyTypes {
        throw new Error('Method not implemented.');
    }
    next(): StrategyTypes {
        throw new Error('Method not implemented.');
    }
    key(): number {
        throw new Error('Method not implemented.');
    }
    valid(): boolean {
        throw new Error('Method not implemented.');
    }
    rewind(): void {
        throw new Error('Method not implemented.');
    }
}

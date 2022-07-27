import React from 'react';
import { useWorker, WORKER_STATUS } from '@koale/useworker';
import bubbleSort from './bubbleSort';

const numbers = [...Array<number>(5000000)].map(
    (e) => ~~(Math.random() * 1000000)
);
const sortNumbers = async (numbers: Array<number>): Promise<Array<number>> =>
    numbers.sort();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function GetOfflineScope() {
    const [getOfflineScopeStatus, setOfflineScopeStatus] =
        React.useState(false);
    const [sortWorker, { status: sortWorkerStatus, kill: killWorker }] =
        useWorker(sortNumbers, {
            timeout: 5000,
            remoteDependencies: [
                'https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.js',
            ],
        });

    console.log('WORKER:', sortWorkerStatus);

    const onWorkerSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        sortWorker(numbers).then((result) => {
            console.log('Bubble Sort useWorker()', result);
            // addToast('Finished: Sort using useWorker.', {
            //     appearance: 'success',
            // });
        });
    };

    return (
        <div>
            <button
                type="button"
                disabled={sortWorkerStatus === WORKER_STATUS.RUNNING}
                className="App-button"
                onClick={(event: React.MouseEvent<HTMLButtonElement>): void =>
                    onWorkerSortClick(event)
                }
            >
                {sortWorkerStatus === WORKER_STATUS.RUNNING
                    ? `Loading...`
                    : `Sort Dates useWorker()`}
            </button>
        </div>
    );
}

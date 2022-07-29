import React from 'react';
import { useWorker, WORKER_STATUS } from '@koale/useworker';
import bubbleSort from './bubbleSort';

const makeHttpCall = async (): Promise<string> => {
    console.log('Making http call');

    const jsonUrl =
        'https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0';

    const response = await fetch(jsonUrl, {
        headers: {
            //'Content-Type': 'application/json',
            // 'Access-Control-Allow-Headers': '*',
        },
        method: 'GET',
    });

    if (response.ok) {
        // if HTTP-status is 200-299
        // get the response body (the method explained below)
        const json = await response.json();
        return json;
    } else {
        alert('HTTP-Error: ' + response.status);
        return '{}';
    }
};

export const MakeHttpCall = (): JSX.Element => {
    const [id, setId] = React.useState('1000');
    const [type, setType] = React.useState('McPkt');

    const [callStatus, setcallStatus] = React.useState(false);
    const [HttpWorker, { status: WorkerStatus, kill: killWorker }] = useWorker(
        makeHttpCall,
        {
            timeout: 50000,
            remoteDependencies: [
                // 'https://cdn.jsdelivr.net/npm/fetch-intercept@2.4.0/lib/browser.js',
                // 'https://cdn.jsdelivr.net/npm/camelcase-keys@8.0.1/index.js',
                //'https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.js',
                // 'https://unpkg.com/axios-fetch-adapter@1.0.0/lib/index.js',
            ],
        }
    );
    console.log('WORKER:', WorkerStatus);
    const onWorkerMakeHttpCallClick = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        HttpWorker().then((result) => {
            console.log('Finished http call', result);
            // addToast('Finished: Sort using useWorker.', {
            //     appearance: 'success',
            // });
        });
    };
    return (
        <div>
            <button
                type="button"
                disabled={WorkerStatus === WORKER_STATUS.RUNNING}
                className="App-button"
                onClick={(event: React.MouseEvent<HTMLButtonElement>): void =>
                    onWorkerMakeHttpCallClick(event)
                }
            >
                {WorkerStatus === WORKER_STATUS.RUNNING
                    ? `Loading...`
                    : `Make Http Call useWorker()`}
            </button>
            <label>Entity Id:</label>
            <input
                type="text"
                value={id}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setId(event.target.value)
                }
            />
            <label>Entity Type:</label>
            <input
                type="text"
                value={type}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setType(event.target.value)
                }
            />
        </div>
    );
};

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

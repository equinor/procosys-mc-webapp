import React from 'react';
import { useWorker, WORKER_STATUS } from '@koale/useworker';
import bubbleSort from './bubbleSort';
import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
const numbers = [...Array<number>(5000000)].map(
    (e) => ~~(Math.random() * 1000000)
);
const sortNumbers = async (numbers: Array<number>): Promise<Array<number>> =>
    numbers.sort();

const makeHttpCall = async (): Promise<string> => {
    console.log('Making http call');

    const jsonUrl =
        'https://www.7timer.info/bin/astro.php?lon=113.2&lat=23.1&ac=0&unit=metric&output=json&tzshift=0';

    const instance = axios.create({
        baseURL: 'https://some-domain.com/api/',

        timeout: 1000,
        adapter: fetchAdapter,
    });

    const data = await instance.get('/whatever-url');

    const response = await fetch(jsonUrl, {
        headers: { 'Access-Control-Allow-Origin': '*' },
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

export function MakeHttpCall() {
    const [callStatus, setcallStatus] = React.useState(false);
    const [HttpWorker, { status: WorkerStatus, kill: killWorker }] = useWorker(
        makeHttpCall,
        {
            timeout: 5000,
            remoteDependencies: [
                'https://cdnjs.cloudflare.com/ajax/libs/axios/0.24.0/axios.js',
                'https://unpkg.com/axios-fetch-adapter@1.0.0/lib/index.js',
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
        </div>
    );
}

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

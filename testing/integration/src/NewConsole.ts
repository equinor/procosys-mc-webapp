import { car } from '@equinor/eds-icons';
import { doc } from 'prettier';
import { StatusRepository } from '../../../src/database/StatusRepository';
import { db } from '../../../src/database/db';
import { IStatus } from '../../../src/database/status';

export class NewConsole {
    element: HTMLUListElement;
    constructor() {
        this.element = document.createElement('ul');
    }

    async getApplicationMode(): Promise<IStatus> {
        const status = await new StatusRepository().getStatus();
        return status;
    }

    async log(txt: string): Promise<void> {
        const li = document.createElement('li');
        const card = document.createElement('div');
        li.style.cssText = 'list-style: none;';

        const cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'container');

        const cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card');
        const databaseStatus = document.createElement('p');
        const info = `Application is in: ${
            (await (
                await this.getApplicationMode()
            ).status)
                ? 'offline'
                : 'normal'
        } mode`;
        databaseStatus.innerText = info;

        cardBody.appendChild(databaseStatus);

        cardContainer.appendChild(cardBody);
        card.appendChild(cardContainer);

        li.appendChild(card);
        this.element.appendChild(li);
    }
}

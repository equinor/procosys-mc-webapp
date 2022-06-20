import * as _ from 'lodash';
const equal = require('deep-equal');

import { db } from '../../../src/database/db';
import { NewConsole } from './NewConsole';

db.open().catch(function (err) {
    console.error('Failed to open db: ' + (err.stack || err));
});

const appDiv: HTMLElement = document.getElementById('app') as HTMLElement;
appDiv.innerHTML = `<h1>Database tests</h1><div id="consoleArea"></div>`;

const newAppDiv: HTMLElement = document.getElementById('newApp') as HTMLElement;
newAppDiv.innerHTML = '<h1>New Console App</h1><div id="newApp"></div>';

const newConsole = new NewConsole();
const newConsoleArea = document.getElementById('newApp') as HTMLDivElement;
newConsoleArea.appendChild(newConsole.element);
newConsole.log('test1');
newConsole.log('test2');
newConsole.log('test3');
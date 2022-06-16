import * as _ from 'lodash';
import { Console } from './console';
const equal = require('deep-equal');

import { StatusRepository } from '../../../src/database/StatusRepository';
import { db } from '../../../src/database/db';

// const byProp1 = tagFilter.getFilterByProp('tagId');
// const byProp2 = tagFilter.getFilterByProp('Dummy');
// const query = tagFilter.build();

db.open().catch(function (err) {
    console.error('Failed to open db: ' + (err.stack || err));
});

const appDiv: HTMLElement = document.getElementById('app') as HTMLElement;

// ===================================
// Bootstrapping
// Add a console element
// ===================================

appDiv.innerHTML = `<h1>Database tests</h1>
<div id="consoleArea"></div>`;

const console = new Console();
const consoleArea = document.getElementById('consoleArea') as HTMLDivElement;
consoleArea.appendChild(console.element);

// Test it:
console.log('Integration testing in browsers');
console.log(`The database:${db.name} is ${db.isOpen() ? 'open' : 'closed'}`);
if (!db.isOpen()) {
    console.log(
        `Trying to open a database connection to The database:${db.name}`
    );
    db.open().then(() => {
        console.log('');
        console.log(
            `The database:${db.name} is ${db.isOpen() ? 'open' : 'closed'}`
        );
        console.log('');
    });
}

console.log(
    '====================================================================\n'
);

 

console.log(
    '====================================================================\n'
);

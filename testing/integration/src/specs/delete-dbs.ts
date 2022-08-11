import { Dexie } from 'dexie';

export const deleteDBs = (names: string[]) =>
    Dexie.getDatabaseNames((names) => {
        console.log('database names: ', names);
        names.forEach(function (name) {
            const db = new Dexie(name);
            db.delete()
                .then(function () {
                    console.log('Database successfully deleted: ', name);
                })
                .catch(function (err) {
                    console.error('Could not delete database: ', name, err);
                })
                .finally(function () {
                    console.log('Done. Now executing callback if passed.');
                });
        });
    });

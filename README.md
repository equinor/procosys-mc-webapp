## Procosys Mechanical Completion Webapp
Mobile application that integrates with Project Completion System (ProCoSys).
The app provides users with a simple mobile interface for performing common MCCR-related tasks on the fly.
Features include: 
* Searching for and viewing scopes for Work Orders, MC packages, Purchase orders and Tags.
* Filling out, signing and adding attachments to checklists.
* Viewing, adding, clearing, verifying and rejecting punch items.

#### Setup
`yarn install`

* Make a copy of "settings.template.json" and place it in the src/ folder. 
* Rename the file to "settings.json"
* Set the auth settings endpoint to a valid Azure function app endpoint.

#### Run
The application can be started with or without a service worker. The service worker is needed to use the offline functionality. 

Without service worker:  `yarn start`

With service worker: 
* Make a file in project folder called .env.production.local containing `PUBLIC_URL=http://localhost:3000`
* `yarn build` (optimized production build is needed)
* `serve build`

Note: If 'serve' is not installed: `npm install --global serve`

#### Test
`yarn test`

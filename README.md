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
`yarn start`

#### Test
`yarn test`
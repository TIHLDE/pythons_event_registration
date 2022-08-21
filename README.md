# Event registration for TIHLDE Pythons

## Setup project

Add the following .env-variables:

```bash
DATABASE_URL=postgresql://postgres:docker@localhost:5432/event_registration
```

Run `yarn` to install packages, `yarn fresh` to setup the databse and load fixtures. Finally run `yarn dev` to run the project.

## todo

- [x] Implement change registration functionality
- [x] Implement create event form
- [x] Add players section
- [x] See registrated players for event (modal)
- [x] See deregistrated players for event (modal)
- [ ] Add statistics
- [x] Add page for getting fines to be registrated
- [x] Make players inactive / remove players
- [x] Move NavBar and Container etc to own component and to be used for every page
- [x] See players that have not answered
- [x] Move modal logic to hook
- [x] Change position

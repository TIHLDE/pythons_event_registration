# Event registration for TIHLDE Pythons

A project used for Event Registration to TIHLDE Python's trainings, matches and social events.
The players in the Event Registration system is automatically updated regularly by fetching the current members from the TIHLDE Pythons group at TIHLDE.org.
New members are added, existing players are updated and former members are deactivated.
Signin is done against the api.tihlde.org, only allowing users a currently active player-account (member of the TIHLDE Pythons group at TIHLDE.org).

Features:

- Teams management
  - Create multiple teams, for example an 11s team and a 7s team
  - Assign individual players to specific teams
  - Set positions of individual players
- Events management
  - Create events of different types, either trainings, matches or social events
  - View all events with filtering by event-type, teams and time-periods
  - Handle user registrations to the events, with overview of who's coming, who's not coming (with reason) and who hasn't answered
  - Only players in a team can sign up for the team's matches
  - View who has signed up to an event by position
- Fines
  - Automatically generate a list of which players should recieve "fines" based on too late registrations, differenciated based on the event type
  - Automatically create the generated fines at the fines-system on tihlde.org by the click of a button
- Notifications
  - Create notifications on the website with an expiry-time and author for everyone to see
- Statistics
  - View match-statistics: goalscorer, assists, red and yellow cards, MOTM
  - View data on who has been on the most events with filtering by event-type, teams and time-periods

## Development

Create a `.env`-file with the following .env-variables:

```bash
# DATABASE_URL must be a connection string to a database and is required
DATABASE_URL=postgresql://root:password@localhost:5432/event_registration_db

# MOCK_TIHLDE_USER_ID is optional
MOCK_TIHLDE_USER_ID=user_id
```

Since signin is connected to actual users at api.tihlde.org, you must activate mocking of TIHLDE-signin if you don't want to login with an actual user. To do this, simply add `MOCK_TIHLDE_USER_ID=<user_id>` in the `.env`-file. When present, you can log in to the application with the given user id and any password you want. **All** calls to api.tihlde.org will also be mocked.
Also, if `MOCK_TIHLDE_USER_ID` is present when running `yarn docker:seed`, a player will be created with connection to the given TIHLDE user-id.

### First setup

Docker-Compose must be available in order to automatically setup a local PostgreSQL-instance for development.
Alternatively, you can run a PostgreSQL-instance yourself and provide a connection-string at `DATABASE_URL` in the `.env`-file.

1. Run `yarn` to install packages
2. Setup database and types:
   - With Docker-Compose: Run `yarn docker:fresh` to create a Docker-container with a PostgreSQL-instance, create tables in it and generate Prisma-types
   - With other PostgreSQL-instance: Run `yarn db:generate` to generate Prisma-types
3. _Optional_:
   - Run `yarn docker:seed` to load fixtures to the connected database to get started with local development faster
4. Finally run `yarn dev` to run the project at http://localhost:3000

### Subsequent starts

If you've already set up the local development environment, you can start the PostgreSQL-instance in Docker with `yarn docker:start` and then start the project with `yarn dev`

### Useful commands

- View the contents of the database using Prisma Studio. Run `yarn db:studio` to run it at http://localhost:5555
- Run `yarn docker:fresh` to tear down the Docker container/database and start it again without any previously existing content, the tables will be recreated, but empty.
- Run `yarn docker:down` to tear down the Docker container/database and remove all data.

## Database migrations

The project uses Prisma for ORM. This includes database-migrations. When you're done with editing the `schema.prisma`-file, run `yarn db:migrate <migration-name>` to add a migration and update your local database.

During development and before you're ready to create a migration, you can also you `yarn db:push` to push the changes in the `schema.prisma`-file to the database without creating a migration. You'll still need to run `yarn db:migrate <migration-name>` and create a migration before pushing to production.

New migrations will automatically be applied in production with the Github Action which runs on push to the `main`-branch.

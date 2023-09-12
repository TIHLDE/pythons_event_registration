# Event registration for TIHLDE Pythons

## Setup project

Add the following .env-variables:

```bash
DATABASE_URL=postgresql://postgres:docker@localhost:5432/event_registration
```

Run `yarn` to install packages, `yarn fresh` to setup the databse, and finally run `yarn dev` to run the project.

## Migrations

The project uses Prisma for ORM. This includes database-migrations. When you're done with editing the `schema.prisma`-file, run `yarn migrate <migration-name>` to add a migration and update your local database.

New migrations will automatically be applied in production with the Github Action which runs on push to the `main`-branch.

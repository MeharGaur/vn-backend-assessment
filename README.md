# VN Backend Assessment

This was a very fun 1 day project using Node.js, GraphQL, Prisma, and Postgres. I have recorded a full explanation video below that shows all tests passing and outlines my thought process.

## Video:
TODO

## Requirements and Specifications:
- SignUp, Login, Change Password, Create, Update, Delete, is contained in [mutations.ts](src/graphql/mutations.ts)
    - Authentication and JWT utility functions are in [auth.ts](src/auth.ts)
    - JWT verification is done in the Apollo context in [context.ts](src/context.ts) so that it's available to all resolvers.
- Querying individual movies, searching/filtering/sorting movies, and pagination is contained in [queries.ts](src/graphql/queries.ts)

## Testing:
- Unit testing using `jest`
- Integration testing of the GraphQL endpoint using `supertest` 
    - I wrote integration tests for all of the mutations in [mutations.test.ts](src/graphql/tests/mutations.test.ts). I tested the queries in the video above using Apollo Studio.

## Hosting:
- PostgreSQL instance hosted on my Google Cloud account




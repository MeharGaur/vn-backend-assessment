# VN Backend Assessment

This was a very fun take-home assessment using Node.js, GraphQL, Prisma, and PostgreSQL. I have recorded a full explanation video below that shows all tests passing and outlines my thought process.

## Video:
[![Watch the video](https://i.imgur.com/ywhjsvF.png)](https://www.loom.com/share/b51dfd55bc6343c7acbd231048e9a8bd)

## Requirements and Specifications:
- SignUp, Login, Change Password, Create, Update, Delete, is contained in [mutations.ts](src/graphql/mutations.ts)
    - Authentication and JWT utility functions are in [auth.ts](src/auth.ts)
    - JWT verification is done in the Apollo context in [context.ts](src/context.ts) so that it's available to all resolvers.
- Querying individual movies, searching/filtering/sorting movies, and pagination is contained in [queries.ts](src/graphql/queries.ts)

## Testing:
- Unit testing using `jest`
- Integration testing of the GraphQL endpoint using `supertest` 
    - I wrote integration tests for all of the mutations in [mutations.test.ts](src/graphql/tests/mutations.test.ts). I tested the queries using Apollo Studio in the video above.

## Hosting:
- PostgreSQL instance hosted on my Google Cloud account

## Next Steps:
Given more time and a higher budget, here are some features I would add to prepare the app for production:
- Containerize the app using Docker, use an orchestration tool like Kubernetes to automatically scale up or down the number of instances based on load.
- Add support for file uploads for movies using AWS S3 and a CDN for example.
- Use code generation tools to automatically generate TypeScript types for resolver arguments based on the GraphQL schema.




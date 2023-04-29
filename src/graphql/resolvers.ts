import { Queries } from "./queries.js";
import { Mutations } from "./mutations.js";


// TODO: Argument types for 'args'
// Note that Apollo automatically handles errors in resolvers
export const resolvers = {
    Query: Queries,
    Mutation: Mutations
};



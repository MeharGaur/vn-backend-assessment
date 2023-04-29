import { Queries } from "./queries";
import { Mutations } from "./mutations";


// TODO: Argument types for 'args'
// Note that Apollo automatically handles errors in resolvers
export const resolvers = {
    Query: Queries,
    Mutation: Mutations
};



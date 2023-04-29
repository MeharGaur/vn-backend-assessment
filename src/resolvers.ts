import { Context } from "./context";
import { comparePasswords, createJWT, hashPassword, mustBeAuthenticated, mustBeOwner, mustNotBeAuthenticated } from "./auth";
import { GraphQLError } from "graphql";


// TODO: Argument types for 'args'
// Note that Apollo automatically handles errors in resolvers
export const resolvers = {
    Query: {
        movieById(parent, args, context: Context) {
            context.prisma.movie.findMany();
        },

        allMovies(parent, args, context: Context) {
            context.prisma.movie.findUnique({
                where: { id: args.id || undefined },
            });
        }
    },

    Mutation: {
        async createMovie(parent, args, context: Context) {
            mustBeAuthenticated(context);

            return await context.prisma.movie.create({
                data: {
                    movieName: args.movieName,
                    description: args.description,
                    directorName: args.directorName,
                    releaseDate: args.releaseDate,
                    creator: { connect: { username: args.username } },
                },
            });
        },

        async updateMovie(parent, args, context: Context) {
            mustBeAuthenticated(context);

            const movie = await context.prisma.movie.findUnique({
                where: { id: args.id || undefined },
            });

            mustBeOwner(context, movie);

            return await context.prisma.movie.update({
                where: { id: args.id || undefined },
                data: {
                    movieName: args.movieName,
                    description: args.description,
                    directorName: args.directorName,
                    releaseDate: args.releaseDate,
                },
            });
        },

        async deleteMovie(parent, args, context: Context) {
            mustBeAuthenticated(context);

            const movie = await context.prisma.movie.findUnique({
                where: { id: args.id || undefined },
            });

            mustBeOwner(context, movie);

            return await context.prisma.movie.delete({
                where: { id: args.id || undefined },
            });
        },

        async signUp(parent, args, context: Context) {
            mustNotBeAuthenticated(context);

            const user = await context.prisma.user.create({
                data: {
                    username: args.username,
                    email: args.email,
                    password: await hashPassword(args.password),
                },
            });

            const token = createJWT(user);
            return token;
        },

        async login(parent, args, context: Context) {
            mustNotBeAuthenticated(context);

            const user = await context.prisma.user.findUnique({
                where: {
                    username: args.username,
                }
            });

            const isValid = await comparePasswords(args.password, user.password);

            if (!isValid) {
                throw new GraphQLError(
                    'Invalid password',
                    { extensions: { code: 'BAD_USER_INPUT' } }
                );
            }

            const token = createJWT(user);
            return token;
        }
    }
};



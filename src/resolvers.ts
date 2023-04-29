import { Context } from "./context";


// TODO: Argument types
export const resolvers = {
    Query: {
        movieById(parent, args, context: Context) {
            context.prisma.movie.findMany()
        },

        allMovies(parent, args, context: Context) {
            context.prisma.movie.findUnique({
                where: { id: args.id || undefined },
            })
        }
    },
    Mutation: {
        createMovie(parent, args, context: Context) {
            context.prisma.movie.create({
                data: {
                    movieName: args.movieName,
                    description: args.description,
                    directorName: args.directorName,
                    releaseDate: args.releaseDate,
                    creator: { connect: { username: args.username } },
                },
            })
        },
        updateMovie(parent, args, context: Context) {
            context.prisma.movie.update({
                where: { id: args.id || undefined },
                data: {
                    movieName: args.movieName,
                    description: args.description,
                    directorName: args.directorName,
                    releaseDate: args.releaseDate,
                },
            })
        },
        deleteMovie(parent, args, context: Context) {
            context.prisma.movie.delete({
                where: { id: args.id || undefined },
            })
        }
    }
};




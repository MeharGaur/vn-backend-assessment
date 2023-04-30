import { Context } from "../context";

export const Queries = {
    async movieById(parent, args: MovieByIdArgs, context: Context) {
        return await context.prisma.movie.findUnique({
            where: { id: args.movieId || undefined },
        });
    },

    async movieByUserId(parent, args: MovieByUserIdArgs, context: Context) {
        return await context.prisma.movie.findMany({
            where: { creatorId: args.userId || undefined },
        });
    },

    async queryMovies(parent, args: QueryMoviesArgs, context: Context) {
        const query = args.searchString
            ? {
                OR: [
                    { movieName: { contains: args.searchString } },
                    { description: { contains: args.searchString } },
                ],
            }
            : {};

        return await context.prisma.movie.findMany({
            where: { ...query },
            take: args.take || undefined,
            skip: args.skip || undefined,
            orderBy: args.orderBy || undefined,
        });
    }
};


type MovieByIdArgs = {
    movieId: number;
};

type MovieByUserIdArgs = {
    userId: number;
};

type QueryMoviesArgs = {
    searchString: string;
    skip: number;
    take: number;
    orderBy: {
        releaseDate: 'asc' | 'desc';
    };
};

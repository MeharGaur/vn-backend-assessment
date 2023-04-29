import { GraphQLError } from "graphql";
import { comparePasswords, createJWT, hashPassword, mustBeAuthenticated, mustBeOwner, mustNotBeAuthenticated } from "../auth";
import { Context } from "../context";


export const Mutations = {
    async createMovie(parent, args: CreateMovieArgs, context: Context) {
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

    async updateMovie(parent, args: UpdateMovieArgs, context: Context) {
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

    async deleteMovie(parent, args: DeleteMovieArgs, context: Context) {
        mustBeAuthenticated(context);

        const movie = await context.prisma.movie.findUnique({
            where: { id: args.id || undefined },
        });

        mustBeOwner(context, movie);

        return await context.prisma.movie.delete({
            where: { id: args.id || undefined },
        });
    },

    async signUp(parent, args: SignUpArgs, context: Context) {
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

    async login(parent, args: LogInArgs, context: Context) {
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
    },

    async changePassword(parent, args: ChangePasswordArgs, context: Context) {
        mustBeAuthenticated(context);

        const user = await context.prisma.user.findUnique({
            where: {
                username: args.username,
            }
        });

        if (user.id !== context.user.id) {
            throw new GraphQLError(
                'Not authorized to modify this user',
                { extensions: { code: 'UNAUTHORIZED' } }
            );
        }

        const isValid = await comparePasswords(args.password, user.password);

        if (!isValid) {
            throw new GraphQLError(
                'Invalid password',
                { extensions: { code: 'BAD_USER_INPUT' } }
            );
        }

        const newPassword = await hashPassword(args.newPassword);

        return await context.prisma.user.update({
            where: { username: args.username },
            data: { password: newPassword },
        });
    }
};


type CreateMovieArgs = {
    movieName: string;
    description: string;
    directorName: string;
    releaseDate: Date;
    username: string;
};

type UpdateMovieArgs = {
    id: number;
    movieName: string;
    description: string;
    directorName: string;
    releaseDate: Date;
};

type DeleteMovieArgs = {
    id: number;
};

type SignUpArgs = {
    username: string;
    email: string;
    password: string;
};

type LogInArgs = {
    username: string;
    password: string;
};

type ChangePasswordArgs = {
    username: string;
    password: string;
    newPassword: string;
};

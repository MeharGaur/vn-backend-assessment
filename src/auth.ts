import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "@prisma/client";
import { Context } from "./context.js";
import { GraphQLError } from "graphql";


export type UserFromJWT = {
    id: number,
    username: string;
};

export const comparePasswords = (password, hash) => {
    return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
    return bcrypt.hash(password, 5);
};

export const createJWT = (user: User) => {
    const token = jwt.sign(<UserFromJWT>{
        id: user.id,
        username: user.username
    },
        process.env.JWT_SECRET
    );
    return token;
};


export const mustBeAuthenticated = (context: Context) => {
    if (!context.isAuthenticated) {
        throw new GraphQLError(
            'Not authenticated',
            { extensions: { code: 'UNAUTHENTICATED' } }
        );
    }
};

export const mustNotBeAuthenticated = (context: Context) => {
    if (context.isAuthenticated) {
        throw new GraphQLError(
            'Already authenticated',
            { extensions: { code: 'UNAUTHORIZED' } }
        );
    }
};

export const mustBeOwner = (context: Context, movie) => {
    if (movie.creatorId !== context.user.id) {
        throw new GraphQLError(
            'Not authorized to modify this movie',
            { extensions: { code: 'UNAUTHORIZED' } }
        );
    }
};


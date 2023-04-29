import { PrismaClient } from '@prisma/client';
import { Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { UserFromJWT } from "./auth";


export interface Context {
    prisma: PrismaClient;
    isAuthenticated: boolean;
    user: UserFromJWT | null;
    res: Response;
};


const prisma = new PrismaClient();


// Verify JWT here in the context so that it's available in all resolvers
export const createContext = async (req: Request, res: Response) => {
    let isAuthenticated = false;
    let user: UserFromJWT = null;

    const bearer = req.headers.authorization;

    const [, token] = bearer.split(' ');

    try {
        user = jwt.verify(token, process.env.JWT_SECRET);
        isAuthenticated = true;
    }
    catch (error) {
        console.error(error);
    }

    return {
        prisma,
        isAuthenticated,
        user,
        res
    };
};


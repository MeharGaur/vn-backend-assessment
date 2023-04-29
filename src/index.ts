import * as dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './typeDefs.js';
import { resolvers } from './resolvers.js';
import { Context, createContext } from "./context.js";


const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    // Use drain http server plugin for graceful shutdown
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Use Apollo middleware
app.use(
    '/',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
        context: createContext,
    }),
);

// Start server
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);

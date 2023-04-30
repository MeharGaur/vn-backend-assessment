
import { prisma } from "../../context";
import { app } from "../../index";
import request from "supertest";
import jwt from "jsonwebtoken";

describe("Mutations", () => {
    // Sign up
    it("should return a valid JWT token after signup", async () => {
        const signUp = `
            mutation {
                signUp(
                    username: "test-signup"
                    email: "test@test.com"
                    password: "test1234"
                )
            }
        `;
        const response = await request(app)
            .post("/graphql")
            .send({ query: signUp });
        console.log('XDDDDDDDD: ', response.body)
        expect(response.body.data.signUp).toBeTruthy();

        const decoded = jwt.verify(
            response.body.data.signUp, 
            process.env.JWT_SECRET
        );
        expect(decoded).toBeTruthy();

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        expect(user).toBeTruthy();

        await prisma.user.delete({
            where: { id: decoded.id },
        });
    });

    // Login
    it("should return a valid JWT token after login", async () => {
        // Signup first
        const signUp = `
            mutation {
                signUp(
                    username: "test-login"
                    email: "test@test.com"
                    password: "test1234"
                )
            }
        `;
        const signUpResponse = await request(app).post("/graphql").send({ query: signUp });
        expect(signUpResponse.body.data.signUp).toBeTruthy();

        const logIn = `
            mutation {
                login(
                    username: "test-login"
                    password: "test1234"
                )
            }
        `;
        const loginResponse = await request(app).post("/graphql").send({ query: logIn });
        expect(loginResponse.body.data.login).toBeTruthy();

        const decoded = jwt.verify(loginResponse.body.data.login, process.env.JWT_SECRET);
        expect(decoded).toBeTruthy();

        await prisma.user.delete({
            where: { id: decoded.id },
        });
    });
});


import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../index";
import { prisma } from "../../context";

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
        const signUpResponse = await request(app)
            .post("/graphql")
            .send({ query: signUp });
        expect(signUpResponse.body.data.signUp).toBeTruthy();

        const logIn = `
            mutation {
                login(
                    username: "test-login"
                    password: "test1234"
                )
            }
        `;
        const loginResponse = await request(app)
            .post("/graphql")
            .send({ query: logIn });
        expect(loginResponse.body.data.login).toBeTruthy();

        const decoded = jwt.verify(
            loginResponse.body.data.login,
            process.env.JWT_SECRET
        );
        expect(decoded).toBeTruthy();

        await prisma.user.delete({
            where: { id: decoded.id },
        });
    });


    // Change password
    it("should only allow login from new password after changing it, and not from old password", async () => {
        // Signup first
        const signUp = `
            mutation {
                signUp(
                    username: "test-change-password"
                    email: "test@test.com"
                    password: "test1234"
                )
            }
        `;
        const signUpResponse = await request(app)
            .post("/graphql")
            .send({ query: signUp });
        expect(signUpResponse.body.data.signUp).toBeTruthy();

        const logIn = `
            mutation {
                login(
                    username: "test-change-password"
                    password: "test1234"
                )
            }
        `;
        const loginResponse = await request(app)
            .post("/graphql")
            .send({ query: logIn });
        expect(loginResponse.body.data.login).toBeTruthy();

        const decoded = jwt.verify(
            loginResponse.body.data.login,
            process.env.JWT_SECRET
        );
        expect(decoded).toBeTruthy();

        // Change password
        const changePassword = `
            mutation {
                changePassword(
                    userId: ${decoded.id}
                    password: "test1234"
                    newPassword: "test12345"
                ) {
                    id
                    username
                }
            }
        `;
        const changePasswordResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${loginResponse.body.data.login}`)
            .send({ query: changePassword });
        expect(changePasswordResponse.body.data.changePassword).toBeTruthy();

        // Login with old password
        const loginWithOldPassword = `
            mutation {
                login(
                    username: "test-change-password"
                    password: "test1234"
                )
            }
        `;
        const loginWithOldPasswordResponse = await request(app)
            .post("/graphql")
            .send({ query: loginWithOldPassword });
        expect(loginWithOldPasswordResponse.body.errors).toBeTruthy();

        // Login with new password
        const loginWithNewPassword = `
            mutation {
                login(
                    username: "test-change-password"
                    password: "test12345"
                )
            }
        `;
        const loginWithNewPasswordResponse = await request(app)
            .post("/graphql")
            .send({ query: loginWithNewPassword });
        expect(loginWithNewPasswordResponse.body.data.login).toBeTruthy();

        await prisma.user.delete({
            where: { id: decoded.id },
        });
    });


    // Create movie
    it("should create a movie", async () => {
        // Signup first
        const signUp = `
            mutation {
                signUp(
                    username: "test-create-movie"
                    email: "test@test.com"
                    password: "test1234"
                )
            }
        `;
        const signUpResponse = await request(app)
            .post("/graphql")
            .send({ query: signUp });
        expect(signUpResponse.body.data.signUp).toBeTruthy();

        const decoded = jwt.verify(
            signUpResponse.body.data.signUp,
            process.env.JWT_SECRET
        );

        // Create movie
        const createMovie = `
            mutation {
                createMovie(
                    movieName: "test-create-movie"
                    description: "test-create-movie"
                    directorName: "test-create-movie"
                    releaseDate: "2021-01-01"
                    userId: ${decoded.id}
                ) {
                    id
                    movieName
                    description
                    releaseDate
                }
            }
        `;
        const createMovieResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${signUpResponse.body.data.signUp}`)
            .send({ query: createMovie });
        expect(createMovieResponse.body.data.createMovie).toBeTruthy();

        // Delete movie
        await prisma.movie.delete({
            where: { id: createMovieResponse.body.data.createMovie.id },
        });

        // Delete user
        await prisma.user.delete({
            where: { id: decoded.id },
        });
    });
});


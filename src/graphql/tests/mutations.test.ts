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


    // Update movie
    it("should update a movie", async () => {
        // Signup first
        const signUp = `
            mutation {
                signUp(
                    username: "test-update-movie"
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
                    movieName: "test-update-movie"
                    description: "test-update-movie"
                    directorName: "test-update-movie"
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

        // Update movie
        const updateMovie = `
            mutation {
                updateMovie(
                    movieId: ${createMovieResponse.body.data.createMovie.id}
                    movieName: "test-update-movie-2"
                    description: "test-update-movie-2"
                    directorName: "test-update-movie-2"
                ) {
                    id
                    movieName
                    description
                    releaseDate
                }
            }
        `;
        const updateMovieResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${signUpResponse.body.data.signUp}`)
            .send({ query: updateMovie });
        expect(updateMovieResponse.body.data.updateMovie).toBeTruthy();
        expect(updateMovieResponse.body.data.updateMovie.movieName).toBe(
            "test-update-movie-2"
        );

        // Delete movie
        await prisma.movie.delete({
            where: { id: createMovieResponse.body.data.createMovie.id },
        });

        // Delete user
        await prisma.user.delete({
            where: { id: decoded.id },
        });
    });


    // Delete movie
    it("should delete a movie", async () => {
        // Signup first
        const signUp = `
            mutation {
                signUp(
                    username: "test-delete-movie"
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
                    movieName: "test-delete-movie"
                    description: "test-delete-movie"
                    directorName: "test-delete-movie"
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

        // Check that it exists
        const checkMovieExists = `
            query {
                movieById(
                    movieId: ${createMovieResponse.body.data.createMovie.id}
                ) {
                    id
                    movieName
                    description
                    releaseDate
                }
            }
        `;
        const checkMovieExistsResponse = await request(app)
            .post("/graphql")
            .send({ query: checkMovieExists });
        expect(checkMovieExistsResponse.body.data.movieById).toBeTruthy();

        // Delete movie
        const deleteMovie = `
            mutation {
                deleteMovie(
                    movieId: ${createMovieResponse.body.data.createMovie.id}
                ) {
                    id
                    movieName
                    description
                    releaseDate
                }
            }
        `;
        const deleteMovieResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${signUpResponse.body.data.signUp}`)
            .send({ query: deleteMovie });
        expect(deleteMovieResponse.body.data.deleteMovie).toBeTruthy();

        // Check that it's deleted
        const checkMovieExistsAfterDelete = `
            query {
                movieById(
                    movieId: ${createMovieResponse.body.data.createMovie.id}
                ) {
                    id
                    movieName
                    description
                    releaseDate
                }
            }
        `;
        const checkMovieExistsAfterDeleteResponse = await request(app)
            .post("/graphql")
            .send({ query: checkMovieExistsAfterDelete });
        expect(checkMovieExistsAfterDeleteResponse.body.data.movieById).toBeNull();

        // Delete user
        await prisma.user.delete({
            where: { id: decoded.id },
        });
    });
});


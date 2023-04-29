

export const typeDefs = `#graphql
  type User {
    username: String
    updatedAt: String
  }

  type Movie {
    movieName: String
    description: String
    directorName: String
    releaseDate: String
    updatedAt: String
    creator: User
  }

  type Query {
    movieById: Movie!
    allMovies: [Movie!]!
  }

  type Mutation {
    createMovie: Movie
    updateMovie: Movie
    deleteMovie: Movie
    # signUp: User
    # login: User
    # changePassword: User
  }
`;



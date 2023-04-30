
export const typeDefs = `#graphql

scalar DateTime

type User {
  id: Int
  username: String
  updatedAt: DateTime
}

type Movie {
  id: Int
  movieName: String
  description: String
  directorName: String
  releaseDate: DateTime
  updatedAt: DateTime
  creatorId: Int
}


type Query {
  movieById(movieId: Int!): Movie
  movieByUserId(userId: Int!): [Movie]
  queryMovies(
      orderBy: MovieOrderByReleaseDateInput, 
      searchString: String, 
      skip: Int, 
      take: Int
  ): [Movie]
}

input MovieOrderByReleaseDateInput {
  releaseDate: SortOrder!
}

enum SortOrder {
  asc
  desc
}


type Mutation {
  createMovie(
      movieName: String!,
      description: String!,
      directorName: String!,
      releaseDate: DateTime,
      userId: Int!,
  ): Movie

  updateMovie(
      movieId: Int!,
      movieName: String,
      description: String,
      directorName: String,
      releaseDate: DateTime,
  ): Movie
  
  deleteMovie(movieId: Int!): Movie

  signUp(
      username: String!,
      password: String!,
      email: String!    
  ): String

  login(
      username: String!,
      password: String!,
  ): String

  changePassword(
      userId: Int!,
      password: String!,
      newPassword: String!
  ): User
}

`;



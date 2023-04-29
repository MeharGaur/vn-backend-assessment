
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
  creator: User
}


type Query {
  movieById(id: Int!): Movie
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
      releaseDate: DateTime!,
      username: String!,
  ): Movie

  updateMovie(
      id: Int!,
      movieName: String!,
      description: String!,
      directorName: String!,
      releaseDate: DateTime!,
  ): Movie
  
  deleteMovie(id: Int!): Movie

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
      username: String!,
      password: String!,
      newPassword: String!
  ): User
}

`;



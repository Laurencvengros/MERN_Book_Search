const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query{
        me: User
    }
    type Book {
        bookId: String!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type User{
        _id: ID!
        username: String
        email:String
        bookCount: Int
        savedBooks: [Book]
    }

    input savedBook{
        authors: [String]
        description: String
        title: String
        bookId: ID!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
      }

    type Mutation{
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook( input: savedBook!): User
        removeBook( bookId: ID!): User
    }
`

module.exports = typeDefs;
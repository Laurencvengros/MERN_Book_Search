const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query{
        me: User
    }
    type Book {
        _id: ID
        bookID: String!
        title: String
        authors: String
        description: String
        image: String
        link: String
    }

    type User{
        _id: ID!
        username: String!
        email:String
        bookCount: Int
        savedBooks: [Book]
    }

    input savedBook{
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
      }

    t
`

module.exports = typeDefs;
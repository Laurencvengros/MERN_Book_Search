const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        _id: ID
        bookID: String
        title: String
        authors: String
        description: String
        image: String
        link: String
    }
`
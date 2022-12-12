const { User } = require('../models/User');
const { Book } = require('../models/Book');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) =>{
            if(context.user){
                const userData = await User.findOne({_id:context.user._id})
                .select('-__v -password');

                return userData
            }
            throw new AuthenticationError('You need to log in first!');
        },
    },
    Mutation: {
        addUser: async (parent, {name, email, password}) => {
            const user = await User.create({name, email, password});
            const token = signToken(user);

            return {token, profile};
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user){
                throw new AuthenticationError('Incorrect email or password');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw){
                throw new AuthenticationError('Incorrect email or password');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async( parent, { newBook }, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet:  {savedBooks: newBook}},
                    {new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Please login first');
        },
        deleteBook: async (parent, { bookId }, context) =>{
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull : {savedBooks: bookId}},
                    {new: true, runValidators: true},
                );
                return updatedUser
            }
            throw new AuthenticationError('You need to login first');
        }
    },

};

module.exports = resolvers;

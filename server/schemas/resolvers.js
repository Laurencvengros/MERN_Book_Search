const  User  = require('../models/User');
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
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);

            return {token, user};
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
        saveBook: async( parent, { input }, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet:  {savedBooks: input}},
                    {new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('Please login first');
        },
        removeBook: async (parent, args, context) =>{
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    {new: true, runValidators: true},
                );
                return updatedUser
            }
            throw new AuthenticationError('You need to login first');
        }
    },

};

module.exports = resolvers;

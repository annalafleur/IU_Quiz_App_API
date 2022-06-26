// Queries
// --- User
const getMyProfile = require('../resolvers/query/user/getMyProfile')
const getQuestionById = require('../resolvers/query/user/getQuestionById')
const getModules = require('../resolvers/query/user/getModules')
const getAllQuestions = require('../resolvers/query/user/getAllQuestions')
// --- Public

// Mutations
// --- User
const addQuestion = require('../resolvers/mutation/user/addQuestion')
const removeQuestion = require('../resolvers/mutation/user/removeQuestion')
// Public
const login = require('../resolvers/mutation/public/login')


const resolvers = {
    Query: {
        getMyProfile,
        getQuestionById,
        getModules,
        getAllQuestions
    },
    Mutation: {
        login,
        addQuestion,
        removeQuestion
    }
}

module.exports = resolvers
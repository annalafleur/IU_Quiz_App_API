// Queries
// --- User
const getMyProfile = require('../resolvers/query/user/getMyProfile')
const getQuestionById = require('../resolvers/query/user/getQuestionById')
const getModules = require('../resolvers/query/user/getModules')
const getAllQuestions = require('../resolvers/query/user/getAllQuestions')
const getRandomQuestionsForModule = require('../resolvers/query/user/getRandomQuestionsForModule')
const getMyOngoingGames = require('../resolvers/query/user/getMyOngoingGames')
const getPastGames = require('../resolvers/query/user/getPastGames')
const getGameById = require('../resolvers/query/user/getGameById')
const getQuestionsForGame = require('../resolvers/query/user/getQuestionsForGame')
// --- Public

// Mutations
// --- User
const addQuestion = require('../resolvers/mutation/user/addQuestion')
const removeQuestion = require('../resolvers/mutation/user/removeQuestion')
const startGame = require('../resolvers/mutation/user/startGame')
const answerGameQuestion = require('../resolvers/mutation/user/answerGameQuestion')
// Public
const login = require('../resolvers/mutation/public/login')


const resolvers = {
    Query: {
        getMyProfile,
        getQuestionById,
        getModules,
        getAllQuestions,
        getRandomQuestionsForModule,
        getMyOngoingGames,
        getPastGames,
        getGameById,
        getQuestionsForGame
    },
    Mutation: {
        login,
        addQuestion,
        removeQuestion,
        startGame,
        answerGameQuestion
    }
}

module.exports = resolvers
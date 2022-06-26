// Third Party
const {AuthenticationError, UserInputError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

const auth = require('../../../common/authentication')

// Type resolvers
const TQuestion = require('../../../types/TQuestion')

// Datenbank
const knex = require('../../../db/db')

async function getQuestionById(_, {question_uuid}, context, info) {
    const fields = gqlFields(info)
    // Prüft Authentifizierung
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Get Question
    const targetQuestion = await knex('questions')
    .select('*')
    .where({
        uuid: question_uuid
    })
    .first()
    if (!targetQuestion){
        throw new UserInputError('Question was not found')
    }
    // Return Daten
    return await TQuestion(targetQuestion, fields)
}

module.exports = getQuestionById
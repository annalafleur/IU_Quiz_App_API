// Third Party
const {AuthenticationError, UserInputError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

const auth = require('../../../common/authentication')

// Type resolvers
const TQuestion = require('../../../types/TQuestion')

// Datenbank
const knex = require('../../../db/db')

async function getAllQuestions(_, {filter}, context, info) {
    const fields = gqlFields(info)
    // Prüft Authentifizierung
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    
    const targetModule = await knex('modules')
    .select('*')
    .where({
        uuid: filter.module_uuid
    })
    .first()
    if (!targetModule){
        throw new UserInputError('Module to filter by was not found')
    }
    const questions = await knex('questions')
    .select('*')
    .where({
        module: targetModule.id
    })
    let arrQuestions = []
    for (let question of questions){
        const questionInfo = await TQuestion(question, fields)
        arrQuestions.push(questionInfo)
    }
    return arrQuestions
}

module.exports = getAllQuestions
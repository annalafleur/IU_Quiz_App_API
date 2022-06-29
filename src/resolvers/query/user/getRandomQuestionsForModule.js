// Third Party
const {AuthenticationError, UserInputError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

// Common
const auth = require('../../../common/authentication')

// Type resolvers
const TQuestion = require('../../../types/TQuestion')

// Database
const knex = require('../../../db/db')

async function getRandomQuestionsForModule(_, {filter}, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Check if module to filter by exists
    const targetModule = await knex('modules')
    .select('*')
    .where({
        uuid: filter.module_uuid
    })
    .first()
    if (!targetModule){
        throw new UserInputError('Module to filter by was not found')
    }
    // Define where object
    let whereObject = {
        module: targetModule.id,
    }
    // Get Questions
    const questions = await knex('questions')
    .select('*')
    .where(whereObject)
    .limit(filter.amount)
    .orderByRaw('random()')
    // Gather questions array items
    let arrQuestions = []
    for (let question of questions){
        const questionInfo = await TQuestion(question, fields)
        arrQuestions.push(questionInfo)
    }
    // Return requested data
    return arrQuestions
}

module.exports = getRandomQuestionsForModule
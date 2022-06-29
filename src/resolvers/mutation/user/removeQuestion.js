// Third Party
const gqlFields = require('graphql-fields')

// Common
const res = require('../../../common/response')
const auth = require('../../../common/authentication')

// Database
const knex = require('../../../db/db')

async function removeQuestion(_, {question_uuid}, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Check if question exists
    const targetQuestion = await knex('questions')
    .select('*')
    .where({
        uuid: question_uuid
    })
    .first()
    if (!targetQuestion){
        return res.fail({
            message: 'Question was not found',
            data: {
                question_uuid: question_uuid
            }
        })
    }
    // Check if i am the author
    if (targetQuestion.author != context.user.id){
        return res.fail({
            message: 'Permission denied',
            data: {
                question_uuid: question_uuid
            }
        })
    }
    // Remove question from database
    await knex('questions')
    .delete()
    .where({
        uuid: question_uuid
    })
    // Return information
    return res.success(
        {
            message: 'Question has been removed'
        },
        {

        }
    )
}

module.exports = removeQuestion
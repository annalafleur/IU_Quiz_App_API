// Third Party
const gqlFields = require('graphql-fields')

const res = require('../../../common/response')
const auth = require('../../../common/authentication')

// Datenbank
const knex = require('../../../db/db')

async function removeQuestion(_, {question_uuid}, context, info) {
    const fields = gqlFields(info)
    // Prüft Authentifizierung
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Prüft, ob gesuchte Frage existiert
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
    // Überprüft, ob User der Autor der Frage ist
    if (targetQuestion.author != context.user.id){
        return res.fail({
            message: 'Permission denied',
            data: {
                question_uuid: question_uuid
            }
        })
    }
    // Entfern Frage aus der Datenbank
    await knex('questions')
    .delete()
    .where({
        uuid: question_uuid
    })
    // Return Information
    return res.success(
        {
            message: 'Question has been removed'
        },
        {

        }
    )
}

module.exports = removeQuestion
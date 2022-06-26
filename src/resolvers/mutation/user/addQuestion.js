// Third Party
const gqlFields = require('graphql-fields')
const { v4: uuidv4 } = require('uuid')

const res = require('../../../common/response')
const auth = require('../../../common/authentication')

// Type resolvers
const TQuestion = require('../../../types/TQuestion')

// Datenbank
const knex = require('../../../db/db')

async function addQuestion(_, {addQuestionInput}, context, info) {
    const fields = gqlFields(info)
    // Prüft Authentifizierung
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Prüft, ob gesuchtes Modul existiert
    const targetModule = await knex('modules')
    .select('*')
    .where({
        uuid: addQuestionInput.module_uuid
    })
    .first()
    if (!targetModule){
        return res.fail({
            message: 'Module was not found',
            data: {
                module_uuid: addQuestionInput.module_uuid
            }
        })
    }
    // Fügt Frage der Datenbank hinzu
    const [newQuestion] = await knex('questions')
    .insert({
        uuid: uuidv4(),
        question: addQuestionInput.question,
        explanation: addQuestionInput.explanation,
        answer_a: addQuestionInput.answer_a,
        answer_b: addQuestionInput.answer_b,
        answer_c: addQuestionInput.answer_c,
        answer_d: addQuestionInput.answer_d,
        correct_answer: addQuestionInput.correct_answer,
        module: targetModule.id,
        author: context.user.id
    })
    .returning('*')
    // Return Information
    return res.success(
        {
            message: 'Question has been added'
        },
        {
            question: await ( async () => {
                if ('question' in fields){
                    return await TQuestion(newQuestion, fields.question)
                } else {
                    return null
                }
            })()
        }
    )
}

module.exports = addQuestion
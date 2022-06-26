const knex = require('../db/db')

async function TQuestion(question, fields){
   
    const questionInfo = {
        uuid: await ( async () => {
            if ('uuid' in fields){
                return question.uuid
            } else {
                return null
            }
        })(),
        question: await ( async () => {
            if ('question' in fields){
                return question.question
            } else {
                return null
            }
        })(),
        explanation: await ( async () => {
            if ('explanation' in fields){
                return question.explanation
            } else {
                return null
            }
        })(),
        answer_a: await ( async () => {
            if ('answer_a' in fields){
                return question.answer_a
            } else {
                return null
            }
        })(),
        answer_b: await ( async () => {
            if ('answer_b' in fields){
                return question.answer_b
            } else {
                return null
            }
        })(),
        answer_c: await ( async () => {
            if ('answer_c' in fields){
                return question.answer_c
            } else {
                return null
            }
        })(),
        answer_d: await ( async () => {
            if ('answer_d' in fields){
                return question.answer_d
            } else {
                return null
            }
        })(),
        correct_answer: await ( async () => {
            if ('correct_answer' in fields){
                return question.correct_answer
            } else {
                return null
            }
        })(),
        module: await ( async () => {
            if ('module' in fields){
                const TModule = require('./TModule')
                const targetModule = await knex('modules')
                .select('*')
                .where({
                    id: question.module
                })
                .first()
                if (!targetModule){
                    return null
                }
                return await TModule(targetModule, fields.module)
            } else {
                return null
            }
        })(),
        author: await ( async () => {
            if ('author' in fields){
                const TUser = require('./TUser')
                const targetUser = await knex('users')
                .select('*')
                .where({
                    id: question.author
                })
                .first()
                if (!targetUser){
                    return null
                }
                return await TUser(targetUser, fields.author)
            } else {
                return null
            }
        })(),
        created_at: await ( async () => {
            if ('created_at' in fields){
                return question.created_at
            } else {
                return null
            }
        })(),
        updated_at: await ( async () => {
            if ('updated_at' in fields){
                return question.updated_at
            } else {
                return null
            }
        })()
    }
    // Return Daten
    return questionInfo
}

module.exports = TQuestion
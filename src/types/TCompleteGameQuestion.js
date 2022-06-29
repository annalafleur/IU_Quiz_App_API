const knex = require('../db/db')

const TUser = require('./TUser')

async function TCompleteGameQuestion(completeGameQuestion, fields){
    // Build return object
    const completeGameQuestionInfo = {
        uuid: await ( async () => {
            if ('uuid' in fields){
                return completeGameQuestion.uuid
            } else {
                return null
            }
        })(),
        user_a_answer: await ( async () => {
            if ('user_a_answer' in fields){
                return completeGameQuestion.user_a_answer
            } else {
                return null
            }
        })(),
        user_b_answer: await ( async () => {
            if ('user_b_answer' in fields){
                return completeGameQuestion.user_b_answer
            } else {
                return null
            }
        })(),
        is_user_a_answer_correct: await ( async () => {
            if ('is_user_a_answer_correct' in fields){
                const targetQuestion = await knex('questions')
                .select('*')
                .where({
                    id: completeGameQuestion.question
                })
                .first()
                if (!targetQuestion){
                    return null
                }
                if (targetQuestion.correct_answer == completeGameQuestion.user_a_answer){
                    return true
                } else {
                    return false
                }
            } else {
                return null
            }
        })(),
        is_user_b_answer_correct: await ( async () => {
            if ('is_user_b_answer_correct' in fields){
                const targetQuestion = await knex('questions')
                .select('*')
                .where({
                    id: completeGameQuestion.question
                })
                .first()
                if (!targetQuestion){
                    return null
                }
                if (targetQuestion.correct_answer == completeGameQuestion.user_b_answer){
                    return true
                } else {
                    return false
                }
            } else {
                return null
            }
        })(),
        game: await ( async () => {
            if ('game' in fields){
                const TGame = require('./TGame')
                const game = await knex('games')
                .select('*')
                .where({
                    id: completeGameQuestion.game
                })
                .first()
                if (!game){
                    return null
                }
                return await TGame(game, fields.game)
            } else {
                return null
            }
        })(),
        question: await ( async () => {
            if ('question' in fields){
                const TQuestion = require('./TQuestion')
                const question = await knex('questions')
                .select('*')
                .where({
                    id: completeGameQuestion.question
                })
                .first()
                if (!question){
                    return null
                }
                return await TQuestion(question, fields.question)
            } else {
                return null
            }
        })(),
        is_played_by_user_a: await ( async () => {
            if ('is_played_by_user_a' in fields){
                return completeGameQuestion.is_played_by_user_a
            } else {
                return null
            }
        })(),
        is_played_by_user_b: await ( async () => {
            if ('is_played_by_user_b' in fields){
                return completeGameQuestion.is_played_by_user_b
            } else {
                return null
            }
        })(),
        created_at: await ( async () => {
            if ('created_at' in fields){
                return completeGameQuestion.created_at
            } else {
                return null
            }
        })(),
        updated_at: await ( async () => {
            if ('updated_at' in fields){
                return completeGameQuestion.updated_at
            } else {
                return null
            }
        })()
    }
    // Return requested data
    return completeGameQuestionInfo
}

module.exports = TCompleteGameQuestion
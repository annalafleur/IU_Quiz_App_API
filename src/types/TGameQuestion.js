const knex = require('../db/db')

const TUser = require('./TUser')
const TQuestion = require('./TQuestion')

async function TGameQuestion(gameQuestion, fields){
    // Build return object
    const gameQuestionInfo = {
        uuid: await ( async () => {
            if ('uuid' in fields){
                return gameQuestion.uuid
            } else {
                return null
            }
        })(),
        is_user_a_answer_correct: await ( async () => {
            if ('is_user_a_answer_correct' in fields){
                const targetQuestion = await knex('questions')
                .select('*')
                .where({
                    id: gameQuestion.question
                })
                .first()
                if (!targetQuestion){
                    return null
                }
                if (targetQuestion.correct_answer == gameQuestion.user_a_answer){
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
                    id: gameQuestion.question
                })
                .first()
                if (!targetQuestion){
                    return null
                }
                if (targetQuestion.correct_answer == gameQuestion.user_b_answer){
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
                    id: gameQuestion.game
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
                const question = await knex('questions')
                .select('*')
                .where({
                    id: gameQuestion.question
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
                return gameQuestion.is_played_by_user_a
            } else {
                return null
            }
        })(),
        is_played_by_user_b: await ( async () => {
            if ('is_played_by_user_b' in fields){
                return gameQuestion.is_played_by_user_b
            } else {
                return null
            }
        })(),
        created_at: await ( async () => {
            if ('created_at' in fields){
                return gameQuestion.created_at
            } else {
                return null
            }
        })(),
        updated_at: await ( async () => {
            if ('updated_at' in fields){
                return gameQuestion.updated_at
            } else {
                return null
            }
        })()
    }
    // Return requested data
    return gameQuestionInfo
}

module.exports = TGameQuestion
const knex = require('../db/db')

const TUser = require('./TUser')

async function TGame(game, fields){
    // Build return object
    const gameInfo = {
        uuid: await ( async () => {
            if ('uuid' in fields){
                return game.uuid
            } else {
                return null
            }
        })(),
        turn: await ( async () => {
            if ('turn' in fields){
                return game.turn
            } else {
                return null
            }
        })(),
        is_game_over: await ( async () => {
            if ('is_game_over' in fields){
                return game.is_game_over
            } else {
                return null
            }
        })(),
        module: await ( async () => {
            if ('module' in fields){
                const TModule = require('./TModule')
                const module = await knex('modules')
                .select('*')
                .where({
                    id: game.module
                })
                .first()
                if (!module){
                    return null
                }
                return await TModule(module, fields.module)
            } else {
                return null
            }
        })(),
        given_up_by: await ( async () => {
            if ('given_up_by' in fields){
                if (game.given_up_by){
                    const given_up_by = await knex('users')
                    .select('*')
                    .where({
                        id: game.given_up_by
                    })
                    .first()
                    if (!given_up_by){
                        return null
                    }
                    return await TUser(given_up_by, fields.given_up_by)
                } else {
                    return null
                }
            } else {
                return null
            }
        })(),
        winner: await ( async () => {
            if ('winner' in fields){
                if (game.winner){
                    const winner = await knex('users')
                    .select('*')
                    .where({
                        id: game.winner
                    })
                    .first()
                    if (!winner){
                        return null
                    }
                    return await TUser(winner, fields.winner)
                } else {
                    return null
                }
            } else {
                return null
            }
        })(),
        loser: await ( async () => {
            if ('loser' in fields){
                if (game.loser){
                    const loser = await knex('users')
                    .select('*')
                    .where({
                        id: game.loser
                    })
                    .first()
                    if (!loser){
                        return null
                    }
                    return await TUser(loser, fields.loser)
                } else {
                    return null
                }
            } else {
                return null
            }
        })(),
        user_sent_by: await ( async () => {
            if ('user_sent_by' in fields){
                const user_sent_by = await knex('users')
                .select('*')
                .where({
                    id: game.user_sent_by
                })
                .first()
                if (!user_sent_by){
                    return null
                }
                return await TUser(user_sent_by, fields.user_sent_by)
            } else {
                return null
            }
        })(),
        user_sent_to: await ( async () => {
            if ('user_sent_to' in fields){
                const user_sent_to = await knex('users')
                .select('*')
                .where({
                    id: game.user_sent_to
                })
                .first()
                if (!user_sent_to){
                    return null
                }
                return await TUser(user_sent_to, fields.user_sent_to)
            } else {
                return null
            }
        })(),
        current_player: await ( async () => {
            if ('current_player' in fields){
                const current_player = await knex('users')
                .select('*')
                .where({
                    id: game.current_player
                })
                .first()
                if (!current_player){
                    return null
                }
                return await TUser(current_player, fields.current_player)
            } else {
                return null
            }
        })(),
        game_questions: await ( async () => {
            if ('game_questions' in fields){
                const TCompleteGameQuestion = require('./TCompleteGameQuestion')
                const complete_game_questions = await knex('game_questions')
                .select('*')
                .where({
                    game: game.id
                })
                .orderBy('id', 'ASC')
                let arrGameQuestions = []
                for (let complete_game_question of complete_game_questions){
                    const complete_game_question_data = await TCompleteGameQuestion(complete_game_question, fields.game_questions)
                    arrGameQuestions.push(complete_game_question_data)
                }
                return arrGameQuestions
            } else {
                return null
            }
        })(),
        created_at: await ( async () => {
            if ('created_at' in fields){
                return game.created_at
            } else {
                return null
            }
        })(),
        updated_at: await ( async () => {
            if ('updated_at' in fields){
                return game.updated_at
            } else {
                return null
            }
        })()
    }
    // Return requested data
    return gameInfo
}

module.exports = TGame
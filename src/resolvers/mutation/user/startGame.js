// Third Party
const gqlFields = require('graphql-fields')
const { v4: uuidv4 } = require('uuid')

// Common
const res = require('../../../common/response')
const auth = require('../../../common/authentication')

// Database
const knex = require('../../../db/db')

// Type resolvers
const TGame = require('../../../types/TGame')

async function startGame(_, {startGameInput}, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Check if target user exists
    const targetUser = await knex('users')
    .select('*')
    .where({
        uuid: startGameInput.user_uuid
    })
    .first()
    if (!targetUser){
        return res.fail({
            message: 'Target user was not found',
            data: {
                user_uuid: startGameInput.user_uuid
            }
        })
    }
    // Check if target user is friend
    const targetFriendship = await knex('friendships')
    .select('*')
    .where({
        user_sent_by: context.user.id,
        user_sent_to: targetUser.id
    })
    .orWhere({
        user_sent_by: targetUser.id,
        user_sent_to: context.user.id
    })
    .first()
    if (!targetFriendship){
        return res.fail({
            message: 'You are no friends with the target user',
            data: {
                user_uuid: startGameInput.user_uuid
            }
        })
    }
    // Check if target module exists
    const targetModule = await knex('modules')
    .select('*')
    .where({
        uuid: startGameInput.module_uuid
    })
    .first()
    if (!targetModule){
        return res.fail({
            message: 'Target module was not found',
            data: {
                module_uuid: startGameInput.module_uuid
            }
        })
    }
    // Pick 12 random questions for module
    const questions = await knex('questions')
    .select('*')
    .limit(12)
    .where({
        module: targetModule.id
    })
    .orderByRaw('random()')
    if (questions.length < 12){
        return res.fail({
            message: `Not enough questions for module '${targetModule.name}' to start the game. Atleast 12 questions are required.`,
            data: {
                module_uuid: startGameInput.module_uuid
            }
        })
    }
    // Create game database object
    const [newGame] = await knex('games').insert({
        uuid: uuidv4(),
        turn: 0,
        module: targetModule.id,
        is_game_over: false,
        user_sent_by: context.user.id,
        user_sent_to: targetUser.id,
        current_player: context.user.id
    })
    .returning('*')
    // Create game questions out of the random questions fetched before
    for (let question of questions){
        await knex('game_questions').insert({
            uuid: uuidv4(),
            game: newGame.id,
            question: question.id
        })
    }
    // Return information
    return res.success(
        {
            message: 'Game has been started'
        },
        {
            game: await ( async () => {
                if ('game' in fields){
                    return await TGame(newGame, fields.game)
                } else {
                    return null
                }
            })()
        }
    )
}

module.exports = startGame
// Third Party
const {AuthenticationError, UserInputError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

// Common
const auth = require('../../../common/authentication')

// Type resolvers
const TGameQuestion = require('../../../types/TGameQuestion')

// Database
const knex = require('../../../db/db')

async function getQuestionsForGame(_, {game_uuid}, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Find target game
    const targetGame = await knex('games')
    .select('*')
    .where({
        uuid: game_uuid,
        is_game_over: false
    })
    .andWhere(function(){
        this.where({
            user_sent_by: context.user.id
        })
        this.orWhere({
            user_sent_to: context.user.id
        })
    })
    .first()
    if (!targetGame){
        throw new UserInputError('Game was not found')
    }
    // Deliver questions up to the current round
    const question_limit = ((targetGame.turn + 1) * 3)
    const game_questions = await knex('game_questions')
    .select('*')
    .where({
        game: targetGame.id
    })
    .limit(question_limit)
    .orderBy('id', 'ASC')
    let arrGameQuestions = []
    for (let game_question of game_questions){
        const game_question_data = await TGameQuestion(game_question, fields)
        arrGameQuestions.push(game_question_data)
    }   
    // Return information
    return arrGameQuestions
}

module.exports = getQuestionsForGame
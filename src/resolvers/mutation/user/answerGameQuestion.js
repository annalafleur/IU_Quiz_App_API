// Third Party
const gqlFields = require('graphql-fields')

// Common
const res = require('../../../common/response')
const auth = require('../../../common/authentication')

// Database
const knex = require('../../../db/db')

// Type resolvers
const TGameQuestion = require('../../../types/TGameQuestion')

async function answerGameQuestion(_, {answerGameQuestionInput}, context, info) {
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
        uuid: answerGameQuestionInput.game_uuid,
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
        return res.fail({
            message: 'Game was not found',
            data: {
                game_uuid: answerGameQuestionInput.game_uuid
            }
        })
    }
    // Check if target game question exists
    const targetGameQuestion = await knex('game_questions')
    .select('*')
    .where({
        uuid: answerGameQuestionInput.game_question_uuid
    })
    .first()
    if (!targetGameQuestion){
        return res.fail({
            message: 'Question was not found',
            data: {
                game_question_uuid: answerGameQuestionInput.game_question_uuid
            }
        })
    }
    // Check if it's my turn
    if (targetGame.current_player != context.user.id){
        return res.fail({
            message: 'It is not your turn to play'
        })
    }
    // Check if target game question is part of round
    const question_limit = ((targetGame.turn + 1) * 3)
    const currentQuestions = await knex('game_questions')
    .select('*')
    .where({
        game: targetGame.id
    })
    .limit(question_limit)
    .orderBy('id', 'ASC')
    const last_question_uuid = currentQuestions[currentQuestions.length - 1].uuid
    console.log(last_question_uuid)
    let arrTargetQuestions = []
    for (let i = 0; i <= 2; i++){
        arrTargetQuestions.push(currentQuestions.pop().uuid)
    }
    if (!arrTargetQuestions.includes(targetGameQuestion.uuid)){
        return res.fail({
            message: 'You cannot answer this question',
            data: {
                game_question_uuid: targetGameQuestion.uuid
            }
        })
    }
    // Check if that question already has been answered
    let is_user_a = true
    if (targetGame.user_sent_by != context.user.id){
        is_user_a = false
    }
    let has_been_played = false
    if (is_user_a){
        if (targetGameQuestion.is_played_by_user_a){
            has_been_played = true
        }
    } else {    
        if (targetGameQuestion.is_played_by_user_b){
            has_been_played = true
        }
    }
    if (has_been_played){
        return res.fail({
            message: 'You have already answered this question',
            data: {
                game_question_uuid: targetGameQuestion.uuid
            }
        })
    }
    // Answer question
    let updateObject = {}
    if (is_user_a){
        updateObject.user_a_answer = answerGameQuestionInput.answer
        updateObject.is_played_by_user_a = true
    } else {
        updateObject.user_b_answer = answerGameQuestionInput.answer
        updateObject.is_played_by_user_b = true
    }
    const [answeredGameQuestion] = await knex('game_questions')
    .update(updateObject)
    .where({
        id: targetGameQuestion.id
    })
    .returning('*')
    // Check which player answered this question
    if (is_user_a){
        // Update current_player if last question of a turn has been answered
        console.log(targetGameQuestion.uuid)
        console.log(last_question_uuid)
        if (targetGameQuestion.uuid == last_question_uuid){
            await knex('games')
            .update({
                current_player: targetGame.user_sent_to
            })
            .where({
                id: targetGame.id
            })
        }
    } else {
        // Check if game is complete or if turn needs to be increased
        if (targetGameQuestion.uuid == last_question_uuid){
            if (question_limit == 12){
                // Find winner & loser - leave winner and loser field at null if it's a draw
                let user_a_points = 0
                let user_b_points = 0
                const allGameQuestions = await knex('game_questions')
                .select('*')
                .where({
                    game: targetGame.id
                })
                .orderBy('id', 'ASC')
                for (let gameQuestion of allGameQuestions){
                    const question = await knex('questions')
                    .select('*')
                    .where({
                        id: gameQuestion.question
                    })
                    .first()
                    if (!question){
                        continue
                    }
                    // Check if player a scored
                    if (gameQuestion.user_a_answer == question.correct_answer){
                        user_a_points++
                    }
                    // Check if player b scored
                    if (gameQuestion.user_b_answer == question.correct_answer){
                        user_b_points++
                    }
                }
                // Define update object
                let updateObject = {
                    is_game_over: true
                }
                if (user_a_points > user_b_points){
                    // Player A won
                    updateObject.winner = targetGame.user_sent_by
                    updateObject.loser = targetGame.user_sent_to
                } else if (user_b_points > user_a_points){
                    // Player B won
                    updateObject.winner = targetGame.user_sent_to
                    updateObject.loser = targetGame.user_sent_by
                } // Else is draw - leave winner and loser fields at null
                // Complete game
                await knex('games')
                .update(updateObject)
            }  else {
                // Increase turn and update current_player
                await knex('games')
                .update({
                    turn: (targetGame.turn + 1),
                    current_player: targetGame.user_sent_by
                })
                .where({
                    id: targetGame.id
                })
            }
        }
    }
    // Return information
    return res.success(
        {
            message: 'Game question has been answered'
        },
        {
            answeredGameQuestion: await ( async () => {
                if ('answeredGameQuestion' in fields){
                    return await TGameQuestion(answeredGameQuestion, fields.answeredGameQuestion)
                } else {
                    return null
                }
            })(),
            is_turn_end: await ( async () => {
                if ('is_turn_end' in fields){
                    if (targetGameQuestion.uuid == last_question_uuid){
                        return true   
                    } else {
                        return false
                    }
                } else {
                    return null
                }
            })(),
        }
    )
}

module.exports = answerGameQuestion
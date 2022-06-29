// Third Party
const { gql } = require('apollo-server-express')

// Schema
const schema = gql`

    scalar JSON
    scalar Date
    scalar UUID

    enum AnswerType{
        A
        B
        C
        D
    }

    type UploadData{
        api_key: String
        cloud_name: String
        timestamp: String
        signature: String
        public_id: String
    }

    type Me{
        uuid: UUID
        email: String
        first_name: String
        last_name: String
        avatar_url: String
        degree: String
        study_start: Date
        friends: [User]
        stats: Stats
        created_at: Date
    }

    type User{
        uuid: UUID
        first_name: String
        last_name: String
        avatar_url: String
        degree: String
        study_start: Date
    }

    type Stats{
        total_games: Int
        total_questions: Int
        wins_percentage: Float
        correct_answers_percentage: Float
    }

    type Module{
        uuid: UUID
        name: String
        created_at: Date
        updated_at: Date
    }

    type Question{
        uuid: UUID
        question: String
        explanation: String
        answer_a: String
        answer_b: String
        answer_c: String
        answer_d: String
        correct_answer: AnswerType
        module: Module
        author: User
        created_at: Date
        updated_at: Date
    }

    type Game{
        uuid: UUID
        turn: Int
        is_game_over: Boolean
        module: Module
        given_up_by: User
        winner: User
        loser: User
        user_sent_by: User
        user_sent_to: User
        current_player: User
        created_at: Date
        updated_at: Date
    }

    type CompleteGame{
        uuid: UUID
        turn: Int
        is_game_over: Boolean
        module: Module
        given_up_by: User
        winner: User
        loser: User
        user_sent_by: User
        user_sent_to: User
        current_player: User
        game_questions: [CompleteGameQuestion]
        created_at: Date
        updated_at: Date
    }

    type GameQuestion{
        uuid: UUID
        is_user_a_answer_correct: Boolean
        is_user_b_answer_correct: Boolean
        game: Game
        question: Question
        is_played_by_user_a: Boolean
        is_played_by_user_b: Boolean
        created_at: Date
        updated_at: Date
    }

    type CompleteGameQuestion{
        uuid: UUID
        user_a_answer: AnswerType
        user_b_answer: AnswerType
        is_user_a_answer_correct: Boolean
        is_user_b_answer_correct: Boolean
        game: Game
        question: Question
        is_played_by_user_a: Boolean
        is_played_by_user_b: Boolean
        created_at: Date
        updated_at: Date
    }

    type RDefault{
        success: Boolean
        message: String
        data: JSON
    }

    type RLogin{
        default: RDefault
        me: Me
        jwt: String
    }

    type RAddQuestion{
        default: RDefault
        question: Question
    }

    type RRemoveQuestion{
        default: RDefault
    }

    type RStartGame{
        default: RDefault
        game: Game
    }

    type RAnswerGameQuestion{
        default: RDefault
        answeredGameQuestion: GameQuestion
        is_turn_end: Boolean
    }

    input AddQuestionInput{
        question: String!
        explanation: String
        answer_a: String!
        answer_b: String!
        answer_c: String!
        answer_d: String!
        correct_answer: AnswerType!
        module_uuid: UUID!
    }

    input GetAllQuestionsFilterInput{
        module_uuid: UUID!
        own_questions_only: Boolean!
    }

    input GetRandomQuestionsForModuleFilterInput{
        module_uuid: UUID!
        amount: Int!
    }

    input StartGameInput{
        user_uuid: UUID!
        module_uuid: UUID!
    }

    input AnswerGameQuestionInput{
        game_uuid: UUID!
        game_question_uuid: UUID!
        answer: AnswerType
    }

    type Query{
        getMyProfile: Me
        getQuestionById(question_uuid: UUID): Question
        getModules: [Module]
        getAllQuestions(filter: GetAllQuestionsFilterInput!): [Question]
        getRandomQuestionsForModule(filter: GetRandomQuestionsForModuleFilterInput!): [Question]
        getMyOngoingGames: [Game]
        getPastGames: [CompleteGame]
        getGameById(game_uuid: UUID!): Game
        getQuestionsForGame(game_uuid: UUID!): [GameQuestion]
    }

    type Mutation{
        login (email: String!, password: String!): RLogin
        addQuestion(addQuestionInput: AddQuestionInput!): RAddQuestion
        removeQuestion(question_uuid: UUID): RRemoveQuestion
        startGame(startGameInput: StartGameInput!): RStartGame
        answerGameQuestion(answerGameQuestionInput: AnswerGameQuestionInput!): RAnswerGameQuestion
    }

`

module.exports = schema
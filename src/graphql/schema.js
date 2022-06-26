// Third Party
const { gql } = require('apollo-server-express')

// Schema
const schema = gql`

    scalar JSON
    scalar Date
    scalar UUID

    enum CorrectAnswer{
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
        correct_answer: CorrectAnswer
        module: Module
        author: User
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

    input AddQuestionInput{
        question: String!
        explanation: String
        answer_a: String!
        answer_b: String!
        answer_c: String!
        answer_d: String!
        correct_answer: CorrectAnswer!
        module_uuid: UUID!
    }

    input GetAllQuestionsFilterInput{
        module_uuid: UUID!
    }

    type Query{
        getMyProfile: Me
        getQuestionById(question_uuid: UUID): Question
        getModules: [Module]
        getAllQuestions(filter: GetAllQuestionsFilterInput!): [Question]
    }

    type Mutation{
        login (email: String!, password: String!): RLogin
        addQuestion(addQuestionInput: AddQuestionInput!): RAddQuestion
        removeQuestion(question_uuid: UUID): RRemoveQuestion
    }

`

module.exports = schema
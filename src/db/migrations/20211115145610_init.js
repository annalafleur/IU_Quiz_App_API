// Initiale Migration

exports.up = function(knex) {
    return knex.schema
        // Users
        .createTable('users', table  => {
            table.increments('id')
            table.uuid('uuid')
                .notNullable()
                .unique()
            table.string('email')
                .notNullable()
                .unique()
            table.string('password')
                .notNullable()
            table.string('first_name')
                .notNullable()
            table.string('last_name')
                .notNullable()
            table.string('avatar_url')
            table.string('degree')
            table.date('study_start')
            table.string('security_token')
                .notNullable()
            table.boolean('is_admin')
                .notNullable()
                .defaultTo(false)
            table.boolean('is_banned')
                .notNullable()
                .defaultTo(false)
            table.boolean('is_verified')
                .notNullable()
                .defaultTo(false)
            table.timestamps(true, true)
        })
        // Modules
        .createTable('modules', table => {
            table.increments('id')
            table.uuid('uuid')
                .notNullable()
                .unique()
            table.string('name')
            table.timestamps(true, true)
        })
        // Questions
        .createTable('questions', table => {
            table.increments('id')
            table.uuid('uuid')
                .notNullable()
                .unique()
            table.string('question')
                .notNullable()
            table.string('explanation')
            table.string('answer_a')
                .notNullable()
            table.string('answer_b')
                .notNullable()
            table.string('answer_c')
                .notNullable()
            table.string('answer_d')
                .notNullable()
            table.enu('correct_answer', ['A', 'B', 'C', 'D'], {
                useNative: true,
                enumName: 'answer_type'
            })
                .notNullable()
            table.integer('module')
                .references('id')
                .inTable('modules')
                .notNullable()
            table.integer('author')
                .references('id')
                .inTable('users')
                .notNullable()
            table.timestamps(true, true)
        })
        // Games
        .createTable('games', table => {
            table.increments('id')
            table.uuid('uuid')
                .notNullable()
                .unique()
            table.integer('turn')
                .notNullable()
                .defaultTo(0)
            table.enu('game_status', ['INVITE_PENDING', 'ACTIVE', 'DONE'], {
                useNative: true,
                enumName: 'game_status_type'
            })
                .notNullable()
            table.integer('module')
                .references('id')
                .inTable('modules')
                .notNullable()
            table.integer('given_up_by')
                .references('id')
                .inTable('users')
            table.integer('user_sent_by')
                .references('id')
                .inTable('users')
                .notNullable()
            table.integer('user_sent_to')
                .references('id')
                .inTable('users')
                .notNullable()
            table.timestamps(true, true)
        })
        // Game Questions
        .createTable('game_questions', table => {
            table.increments('id')
            table.uuid('uuid')
                .notNullable()
                .unique()
            table.enu('user_a_answer', null, {
                useNative: true,
                existingType: true,
                enumName: 'answer_type'
            })
                .notNullable()
            table.enu('user_b_answer', null, {
                useNative: true,
                existingType: true,
                enumName: 'answer_type'
            })
                .notNullable()
            table.integer('game')
                .references('id')
                .inTable('games')
                .notNullable()
            table.integer('question')
                .references('id')
                .inTable('questions')
                .notNullable()
            table.timestamps(true, true)
        })
        // Friendships
        .createTable('friendships', table => {
            table.increments('id')
            table.uuid('uuid')
                .notNullable()
                .unique()
            table.integer('user_sent_by')
                .references('id')
                .inTable('users')
                .notNullable()
            table.integer('user_sent_to')
                .references('id')
                .inTable('users')
                .notNullable()
            table.timestamps(true, true)
        })
}

exports.down = function(knex) {
    return knex.schema
        .raw('DROP TYPE answer_type CASCADE')
        .raw('DROP TABLE users CASCADE')
        .raw('DROP TABLE questions CASCADE')
}

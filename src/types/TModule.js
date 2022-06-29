const knex = require('../db/db')

async function TModule(module, fields){
    // Build return object
    const moduleInfo = {
        uuid: await ( async () => {
            if ('uuid' in fields){
                return module.uuid
            } else {
                return null
            }
        })(),
        name: await ( async () => {
            if ('name' in fields){
                return module.name
            } else {
                return null
            }
        })(),
        created_at: await ( async () => {
            if ('created_at' in fields){
                return module.created_at
            } else {
                return null
            }
        })(),
        updated_at: await ( async () => {
            if ('updated_at' in fields){
                return module.updated_at
            } else {
                return null
            }
        })(),
    }
    // Return requested data
    return moduleInfo
}

module.exports = TModule
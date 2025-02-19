import knex from 'knex'
import dotenv from 'dotenv'
dotenv.config() 

const { PGHOST, PGUSER, PGPASSWORD, BGDATABASE, PGPORT} = process.env

export const db = knex({
    client: 'pg',
    connection: {
        host: PGHOST,
        port: PGPORT,
        user: PGUSER,
        password: PGPASSWORD,
        database: BGDATABASE,
        ssl: {rejectUnauthorized: false} // permite insequre connection
    }
})
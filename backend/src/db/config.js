import knex from 'knex';

const db = knex({
    client: "sqlite3",

    connection: {
        filename: './src/data/inteligence.sqlite',
    },
    useNullAsDefault: true,
});

async function setup() {
    const hasUsers = await db.schema.hasTable('users');
    if (!hasUsers) {
        await db.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('username').unique().notNullable();
            table.string('password').notNullable();
        });
    }

    const hasResults = await db.schema.hasTable('results');
    if (!hasResults) {
        await db.schema.createTable('results', (table) => {
            table.increments('id').primary();
            table.integer('user_id').references('id').inTable('users');
            table.string('dominant_type');
            table.json('scores');
            table.timestamp('created_at').defaultTo(db.fn.now());
        });
    }
}

setup();

export default db;
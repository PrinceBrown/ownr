const { readFileSync } = require('fs');
const { join } = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'animals',
  password: 'badman1',
  port: 5432,
});

const checkTableExists = async (client, tableName) => {
  try {
    const result = await client.query(`SELECT * FROM pg_tables WHERE tablename = '${tableName}'`);
    return result.rowCount !== 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
 
const createTables = async () => {
  try {
    const schema = readFileSync(join(__dirname, '..', 'data', 'schema.sql'), 'utf-8');
    const seed = readFileSync(join(__dirname, '..', 'data', 'seed.sql'), 'utf-8');
    const client = await pool.connect();
    console.log(typeof client);

    client.query(schema);
    client.query(seed);

    console.log('schema', schema);
    console.log('Tables created successfully');
    client.release();
  } catch (err) {
    console.error(err);
  }
};
module.exports = {
  pool,
  checkTableExists,
  createTables,
};

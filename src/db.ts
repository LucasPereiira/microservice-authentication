import { Pool } from "pg";

const connectionString = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

const db = new Pool({connectionString});

export default db;
import * as dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';
import { fileURLToPathBuffer } from 'node:url';
const pool = mysql.createPool({
    uri: process.env.CONNECTION_STRING,
    connectionLimit: 10,
    waitForConnections: true,
    idleTimeout: 6000,
    queueLimit: 0,
    multipleStatements: true,
});

export default pool;


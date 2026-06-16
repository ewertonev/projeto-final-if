import * as dotenv from 'dotenv';
dotenv.config();
console.log('CONNECTION_STRING =', process.env.CONNECTION_STRING);
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

import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
	uri: process.env.CONNECTION_STRING,
	connectionLimit: 10,
	waitForConnections: true,
	idleTimeout: 60000,
	queueLimit: 0,
	multipleStatements: true,
});

export default pool;

import pool from '../../database/conexao.js';
export class BaseDao {
    DB;
    constructor() {
        this.DB = pool;
    }
}

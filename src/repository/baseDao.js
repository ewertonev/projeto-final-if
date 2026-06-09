import pool from '../../config/conexao.js';
export class BaseDao {
    DB;
    constructor() {
        this.DB = pool;
    }
}

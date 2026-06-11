import { UsuariosDao } from '../repository/usuarioDao.js';
class UsusarioServices {
    constructor() {
        this.UsuarioDao = new UsuariosDao();
    }
    async getAll() {
        let dados = await this.UsuarioDao.Usuarios();
        return dados;
    }
}
let d = new UsusarioServices();
console.log(await d.getAll());

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS consumo;
DROP TABLE IF EXISTS pagamentos;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS quartos;
DROP TABLE IF EXISTS tipos_quartos;
DROP TABLE IF EXISTS usuarios_roles;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS servicos;

SET FOREIGN_KEY_CHECKS = 1;

  CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    -- cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20) UNIQUE,
    senha TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT (NOW()),
    CHECK(telefone is not null or email is not null)
  );

  CREATE TABLE IF NOT EXISTS usuarios_roles (
    id_usuario INT NOT NULL,
    id_role INT NOT NULL,
    PRIMARY KEY (id_usuario, id_role),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
      ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_role) REFERENCES roles(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  );


  CREATE TABLE IF NOT EXISTS tipos_quartos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    capacidade INT NOT NULL,
    valor_diaria DECIMAL(10,2) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quartos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(10) UNIQUE NOT NULL,
    andar INT NOT NULL,
    id_tipo_quarto INT,
    estado ENUM ('disponivel', 'manutencao', 'limpeza', 'desativado')
      NOT NULL DEFAULT 'disponivel',
    FOREIGN KEY (id_tipo_quarto) REFERENCES tipos_quartos(id)
      ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_hospede INT NOT NULL,
    id_quarto INT NOT NULL,
    inicio DATE NOT NULL,
    fim DATE NOT NULL,
    quantidade_hospedes INT NOT NULL,
    estado ENUM ('pendente', 'confirmada', 'cancelada', 'finalizada', 'faltou')
      NOT NULL DEFAULT 'pendente',
    data_criacao TIMESTAMP NOT NULL DEFAULT (NOW()),
    CHECK (inicio <= fim),
    FOREIGN KEY (id_hospede) REFERENCES usuarios(id)
      ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_quarto) REFERENCES quartos(id)
      ON DELETE RESTRICT ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS pagamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_reserva INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    estado ENUM ('pendente', 'pago', 'cancelado')
      NOT NULL DEFAULT 'pendente',
    pago_em TIMESTAMP,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS servicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS consumos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_reserva INT NOT NULL,
    id_servico INT NOT NULL,
    descricao TEXT NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    estado ENUM ('pendente', 'cancelado', 'finalizado')
      NOT NULL DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT (NOW()),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id)
      ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_servico) REFERENCES servicos(id)
      ON DELETE RESTRICT ON UPDATE CASCADE
  );

  SET FOREIGN_KEY_CHECKS = 0;

  TRUNCATE TABLE usuarios_roles;
  TRUNCATE TABLE roles;

  SET FOREIGN_KEY_CHECKS = 1;

  INSERT INTO roles(nome) 
    VALUES("Gerente"),("Recepcionista"),("Hospede");
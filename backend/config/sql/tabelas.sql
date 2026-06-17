SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pagamentos;
DROP TABLE IF EXISTS formas_pagamento;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS quartos;
DROP TABLE IF EXISTS tipos_quartos;
DROP TABLE IF EXISTS hospedes;
DROP TABLE IF EXISTS funcionarios;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS funcionarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(20) UNIQUE,
  data_nascimento DATE NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  senha TEXT NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (telefone IS NOT NULL OR email IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS hospedes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(20) UNIQUE,
  data_nascimento DATE NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (telefone IS NOT NULL OR email IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS tipos_quartos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  capacidade INT NOT NULL,
  valor_diaria DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (valor_diaria > 0),
  CHECK (capacidade > 0)
);

CREATE TABLE IF NOT EXISTS quartos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(10) UNIQUE NOT NULL,
  andar INT NOT NULL,
  id_tipo_quarto INT NOT NULL,
  estado ENUM ('disponivel', 'manutencao', 'limpeza', 'desativado')
    NOT NULL DEFAULT 'disponivel',
  FOREIGN KEY (id_tipo_quarto) REFERENCES tipos_quartos(id)
    ON UPDATE CASCADE,
  CHECK (andar > 0)
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_hospede INT NOT NULL,
  id_quarto INT NOT NULL,
  inicio DATE NOT NULL,
  fim DATE NOT NULL,
  quantidade_hospedes INT NOT NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM ('confirmada', 'finalizada', 'cancelada', 'faltou')
    NOT NULL DEFAULT 'confirmada',
  CHECK (inicio < fim),
  CHECK (quantidade_hospedes > 0),
  INDEX (id_quarto, inicio, fim),
  INDEX (id_hospede, estado),
  FOREIGN KEY (id_hospede) REFERENCES hospedes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_quarto) REFERENCES quartos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS formas_pagamento (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_reserva INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  forma_pagamento INT NOT NULL,
  estado ENUM ('pendente', 'pago', 'cancelado')
    NOT NULL DEFAULT 'pendente',
  pago_em TIMESTAMP NULL,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_reserva) REFERENCES reservas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (forma_pagamento) REFERENCES formas_pagamento(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (valor > 0)
);

INSERT INTO tipos_quartos (id, nome, descricao, capacidade, valor_diaria, ativo) VALUES
  (1, 'Standard', 'Quarto padrão confortável', 2, 100.00, TRUE),
  (2, 'Luxo', 'Quarto luxo com vista e hidromassagem', 3, 150.00, TRUE),
  (3, 'Premium', 'Suíte master premium com tudo incluso', 4, 250.00, TRUE)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  descricao = VALUES(descricao),
  capacidade = VALUES(capacidade),
  valor_diaria = VALUES(valor_diaria),
  ativo = VALUES(ativo);

INSERT INTO formas_pagamento (id, nome, ativo) VALUES
  (1, 'Dinheiro', TRUE),
  (2, 'Cartão de crédito', TRUE),
  (3, 'Cartão de débito', TRUE),
  (4, 'Pix', TRUE)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  ativo = VALUES(ativo);

DROP PROCEDURE IF EXISTS add_usuario;


CREATE PROCEDURE add_usuario(
    IN p_nome VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_telefone VARCHAR(20),
    IN p_senha TEXT,
    IN p_data_nascimento DATE,
    IN p_roles JSON
)
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE cont INT DEFAULT 0;

    DECLARE role_id INT;
    DECLARE usuario_id INT;

    INSERT INTO usuarios (
        nome,
        email,
        telefone,
        senha,
        data_nascimento
    )
    VALUES (
        p_nome,
        p_email,
        p_telefone,
        p_senha,
        p_data_nascimento
    );

    SET usuario_id = LAST_INSERT_ID();

    SET total = JSON_LENGTH(p_roles);

    WHILE cont < total DO

        SET role_id = JSON_EXTRACT(
            p_roles,
            CONCAT('$[', cont, ']')
        );

        INSERT INTO usuarios_roles (
            id_usuario,
            id_role
        )
        VALUES (
            usuario_id,
            role_id
        );

        SET cont = cont + 1;

    END WHILE;

    SELECT usuario_id AS id;

END;


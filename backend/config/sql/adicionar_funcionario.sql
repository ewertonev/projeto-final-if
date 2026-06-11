    CREATE PROCEDURE add_funcionario(
        IN p_nome VARCHAR(100),
        IN p_email VARCHAR(255),
        IN p_telefone VARCHAR(20),
        IN p_senha TEXT,
        IN p_data_nascimento DATE,
        IN p_papeis JSON
    )
    BEGIN
        DECLARE total INT DEFAULT 0;
        DECLARE cont INT DEFAULT 0;

        DECLARE papel_id INT;
        DECLARE funcionario_id INT;

        INSERT INTO funcionarios (
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

        SET funcionario_id = LAST_INSERT_ID();

        SET total = COALESCE(JSON_LENGTH(p_papeis),0);

        WHILE cont < total DO

            SET papel_id = JSON_EXTRACT(
                p_papeis,
                CONCAT('$[', cont, ']')
            );

            INSERT INTO funcionarios_papeis (
                id_funcionario,
                id_papel
            )
            VALUES (
                funcionario_id,
                papel_id
            );

            SET cont = cont + 1;

        END WHILE;

        SELECT funcionario_id AS id;

    END;
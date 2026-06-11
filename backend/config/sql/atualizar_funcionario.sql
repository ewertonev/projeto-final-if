CREATE PROCEDURE update_funcionario(
    IN p_id INT,
    IN p_papeis JSON
)
BEGIN
    DECLARE total INT DEFAULT 0;
    DECLARE cont INT DEFAULT 0;
    DECLARE papel_id INT;

    DELETE FROM funcionarios_papeis
    WHERE id_funcionario = p_id;

    SET total = COALESCE(JSON_LENGTH(p_papeis), 0);

    WHILE cont < total DO

        SET papel_id = JSON_EXTRACT(
            p_papeis,
            CONCAT('$[', cont, ']')
        ) + 0;

        INSERT INTO funcionarios_papeis (
            id_funcionario,
            id_papel
        )
        VALUES (
            p_id,
            papel_id
        );

        SET cont = cont + 1;

    END WHILE;

    SELECT p_id AS id;

END;
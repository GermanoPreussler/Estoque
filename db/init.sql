CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria_id BIGINT NOT NULL REFERENCES categorias(id),
    quantidade INTEGER NOT NULL,
    valor_unitario NUMERIC(19,2) NOT NULL,
    quantidade_minima INTEGER NOT NULL,
    criado_em TIMESTAMP,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE movimentacoes_estoque (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL REFERENCES produtos(id),
    tipo VARCHAR(10) NOT NULL,
    quantidade INTEGER NOT NULL,
    data TIMESTAMP
);

-- Categorias iniciais
INSERT INTO categorias (nome) VALUES ('Monitores');
INSERT INTO categorias (nome) VALUES ('Periféricos');
INSERT INTO categorias (nome) VALUES ('Armazenamento');
INSERT INTO categorias (nome) VALUES ('Redes');
INSERT INTO categorias (nome) VALUES ('Memória');

-- Produtos iniciais (categoria_id segue a ordem de inserção acima: 1=Monitores, 2=Periféricos, 3=Armazenamento, 4=Redes, 5=Memória)
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Monitor LG 24 Full HD', 1, 12, 899.90, 3, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Monitor Samsung 27 Curvo', 1, 2, 1450.00, 3, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Teclado Mecânico Redragon', 2, 25, 249.90, 5, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Mouse Logitech G203', 2, 40, 129.50, 10, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Headset HyperX Cloud Stinger', 2, 4, 349.00, 5, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('SSD Kingston 480GB', 3, 15, 229.00, 4, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('HD Externo Seagate 1TB', 3, 8, 349.90, 3, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Pen Drive SanDisk 64GB', 3, 50, 39.90, 10, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Roteador TP-Link Wi-Fi 6', 4, 6, 389.00, 4, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Switch 8 Portas Gigabit', 4, 3, 219.90, 3, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Cabo de Rede Cat6 5m', 4, 100, 19.90, 20, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Memória RAM 16GB DDR4', 5, 8, 339.90, 2, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Memória RAM 8GB DDR4', 5, 1, 189.90, 4, TRUE);
INSERT INTO produtos (nome, categoria_id, quantidade, valor_unitario, quantidade_minima, ativo) VALUES ('Fonte 600W 80 Plus', 2, 12, 389.00, 3, TRUE);

-- Movimentações iniciais (produto_id segue a ordem de inserção dos produtos acima, 1 a 15)
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (1, 'entrada', 15, NOW() - INTERVAL '10 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (1, 'saida', 3, NOW() - INTERVAL '4 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (2, 'entrada', 5, NOW() - INTERVAL '8 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (2, 'saida', 3, NOW() - INTERVAL '2 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (5, 'entrada', 10, NOW() - INTERVAL '15 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (5, 'saida', 6, NOW() - INTERVAL '1 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (13, 'entrada', 8, NOW() - INTERVAL '5 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (14, 'entrada', 4, NOW() - INTERVAL '20 days');
INSERT INTO movimentacoes_estoque (produto_id, tipo, quantidade, data) VALUES (14, 'saida', 3, NOW() - INTERVAL '3 days');
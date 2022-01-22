
create database market_cubos

create table usuarios (
id serial primary key,
nome varchar(100),
nome_loja varchar(150),
email text unique,
senha text
)

create table produtos (
id serial primary key,
usuario_id int references usuarios (id),
nome varchar(150),
quantidade int,
categoria varchar(60),
preco int,
descricao text,
imagem text   
)


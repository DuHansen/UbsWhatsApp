# Projeto UBS WhatsApp

Este projeto é uma aplicação que envolve um backend e frontend conectados por meio de Docker Compose. O backend e o frontend se comunicam e são configurados para rodar em ambientes de desenvolvimento e produção.

## Requisitos

- Docker
- Docker Compose

## Instalação

### 1. Clonar o repositório

Primeiro, clone o repositório para sua máquina local:

```bash
git clone [https://link-do-seu-repositorio.git](https://github.com/DuHansen/UbsWhatsApp)
cd UbsWhatsApp
```
### 2. Instalar dependências do Docker
Após clonar o repositório, você deve instalar as dependências necessárias para o projeto. Com o Docker e Docker Compose instalados, você pode simplesmente executar:

```bash
docker-compose up --build
```
Isso irá construir e rodar os containers de backend e frontend, conforme descrito no arquivo docker-compose.yml

### 3. Variáveis de Ambiente
O backend será executado em modo de produção (NODE_ENV=production).

O frontend será executado em modo de desenvolvimento (NODE_ENV=development).

### 4. Acessando a Aplicação
O backend estará disponível na porta 3000, acessível pelo http://localhost:3000.

O frontend estará disponível na porta 5173, acessível pelo http://localhost:5173.

Estrutura do Projeto
backend/: Contém o código do backend do bot, que usa a porta 3000.

frontend/: Contém o código do frontend do bot, configurado para rodar na porta 5173.

### Como Funciona
O backend é executado em ambiente de produção e expõe uma API ou lógica de backend na porta 3000.

O frontend é executado em ambiente de desenvolvimento, permitindo uma interface interativa de configuração e comunicação com o bot WhatsApp na porta 5173.

Parar a Aplicação
Para parar os containers, use o seguinte comando:

```bash
docker-compose down
```
### Contribuindo
Faça o fork deste repositório.

Crie uma branch para suas modificações (git checkout -b feature/nova-funcionalidade).

Faça commit das suas alterações (git commit -am 'Adiciona nova funcionalidade').

Push para a branch (git push origin feature/nova-funcionalidade).

Abra um Pull Request.

### Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.
```bash

---

Este arquivo `README.md` descreve o processo de instalação, execução e como trabalhar com o Docker Compose para rodar o backend e frontend da aplicação.

```



# 🛒 CodeStore — Projeto Final Bootcamp #ElasTech PagBank 

# 📖 Descrição do Projeto

O CodeStore é uma aplicação E-commerce completa desenvolvida como projeto final do curso de Java com Spring Boot.
A plataforma permite que clientes naveguem por um catálogo de produtos, adicionem itens ao carrinho e finalizem pedidos, enquanto administradores podem gerenciar o estoque, cadastrar novos produtos e atualizar o status dos pedidos.

O sistema combina uma interface web moderna com uma arquitetura robusta no backend, garantindo segurança, desempenho e facilidade de manutenção.

# 🧩 Tecnologias Utilizadas

🔹 Backend

Java 21

Spring Boot 3+

Spring Web (API REST)

Spring Data JPA / Hibernate

Spring Validation

Maven

🔹 Frontend

HTML5

CSS3

JavaScript (ES6+)

🔹 Banco de Dados

MySQL 8+

# 🏗️ Arquitetura da Solução

O projeto é dividido em quatro camadas principais:

*1. Frontend (Vitrine da Loja)*
Interface desenvolvida em HTML, CSS e JS.
Exibe produtos, permite adicionar ao carrinho e finalizar compras de forma dinâmica (sem recarregar a página).


*2. Backend (API REST Spring Boot)*
Responsável por toda a lógica de negócio, validações e persistência de dados.
Inclui endpoints para:

Gerenciamento de Usuários, Produtos e Pedidos;

Controle de status de pedidos (“pendente”, “pago”, “enviado”);

Operações CRUD restritas ao administrador.

*3. Banco de Dados (MySQL)*
Armazena informações de usuários, produtos e pedidos.
As relações seguem o seguinte modelo:

Usuario (1) — (N) Pedido

Pedido (N) — (N) Produto


*4. Segurança (Camada de Autenticação e Controle de Acesso)*
Permite distinguir ações entre usuário comum e administrador, garantindo integridade e segurança nas operações do sistema.

# 📦 Estrutura de Pastas

CodeStore/
├── backend/
│   ├── src/main/java/com/codestore/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── CodestoreApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   └── pom.xml
│
├── frontend/
│   ├── index.html
│   ├── admin.html
│   ├── carrinho.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── carrinho.js
│   └── assets/
│       └── imagens-produtos/
│
└── README.md

# ⚙️ Funcionalidades Principais

👤 Usuário

Visualiza produtos disponíveis;

Adiciona itens ao carrinho;

Calcula o total da compra em tempo real;

Finaliza o pedido.

🛠️ Administrador

Cadastra, edita e remove produtos;

Gerencia pedidos (alterando status);

Acompanha o histórico de vendas.

# 🧮 Modelagem do Banco de Dados

Entidades Principais:

Entidade	Atributos Principais	Relacionamentos

Usuario	id, nome, email, senha, tipo	1:N → Pedido
Produto	id, nome, descrição, preço, imagem	N:N → Pedido
Pedido	id, data, status, valor_total	N:N → Produto / N:1 → Usuario

# 🚀 Como Executar o Projeto

1️⃣ Clonar o repositório

git clone https://github.com/seu-usuario/ProjetoFinal_ElasTech.git
cd ProjetoFinal_ElasTech

2️⃣ Configurar o Banco de Dados

Crie um banco no MySQL:

CREATE DATABASE codestore;

Atualize o arquivo application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/codestore
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

3️⃣ Executar o Backend

cd backend
mvn spring-boot:run

O backend será iniciado em:

http://localhost:8080

4️⃣ Executar o Frontend

Abra o arquivo frontend/index.html diretamente no navegador
ou sirva os arquivos com uma extensão como Live Server (VSCode).


🧪 Endpoints Principais (Exemplo)

Método	Endpoint	Descrição

GET	/produtos	Lista todos os produtos
GET	/produtos/{id}	Retorna produto por ID
POST	/produtos	Cadastra novo produto (admin)
PUT	/produtos/{id}	Atualiza produto existente
DELETE	/produtos/{id}	Exclui produto (admin)
POST	/pedidos	Cria um novo pedido
PUT	/pedidos/{id}/status	Atualiza status do pedido

# 🎨 Interface e Experiência do Usuário

O CodeStore oferece:

Layout limpo e responsivo;

Exibição em grade dos produtos com imagem, nome e preço;

Carrinho de compras dinâmico;

Seção administrativa funcional e intuitiva.

# 🧰 Critérios Atendidos

✅ CRUD completo de produtos
✅ Carrinho dinâmico com cálculo em tempo real
✅ Fluxo de criação e atualização de pedidos
✅ Modelagem relacional correta (Usuário–Pedido–Produto)
✅ Boas práticas de código (camadas separadas, validação, tratamento de exceções)
✅ Documentação completa
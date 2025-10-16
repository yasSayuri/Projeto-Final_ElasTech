# 🛒 CodeStore — Projeto Final Bootcamp #ElasTech PagBank 

# 📖 Descrição do Projeto

O CodeStore é uma aplicação E-commerce completa desenvolvida como projeto final do curso de Java com Spring Boot.
A plataforma permite que clientes naveguem por um catálogo de produtos, adicionem itens ao carrinho e finalizem pedidos, enquanto administradores podem gerenciar o estoque, cadastrar novos produtos e atualizar o status dos pedidos.

O sistema combina uma interface web moderna com uma arquitetura robusta no backend, garantindo segurança, desempenho e facilidade de manutenção.

# 🧩 Tecnologias Utilizadas

<img src="https://img.shields.io/badge/Java-ED8B00.svg?style=for-the-badge&logo=Java&logoColor=white">&nbsp;<img src="https://img.shields.io/badge/Spring-6DB33F.svg?style=for-the-badge&logo=Spring&logoColor=white">&nbsp;<img src="https://img.shields.io/badge/Spring%20Boot-6DB33F.svg?style=for-the-badge&logo=Spring-Boot&logoColor=white">&nbsp;<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=for-the-badge&logo=HTML5&logoColor=white">&nbsp;<img src="https://img.shields.io/badge/CSS-663399.svg?style=for-the-badge&logo=CSS&logoColor=white">&nbsp;<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black">&nbsp;<img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=MySQL&logoColor=white">

# 🏗️ Arquitetura da Solução

O projeto é dividido em quatro camadas principais:

**1. Frontend (Vitrine da Loja)**

- Interface desenvolvida em HTML, CSS e JS
- Exibe produtos, permite adicionar ao carrinho e finalizar compras de forma dinâmica (sem recarregar a página)

**2. Backend (API REST Spring Boot)**

- Responsável por toda a lógica de negócio, validações e persistência de dados.
Inclui endpoints para:

- Gerenciamento de Usuários, Produtos e Pedidos
- Controle de status de pedidos (“pendente”, “pago”, “enviado”)
- Operações CRUD restritas ao administrador

**3. Banco de Dados (MySQL)**

- Armazena informações de usuários, produtos e pedidos.
- As relações seguem o seguinte modelo:

| Entidade 1 | Cardinalidade | Entidade 2 |
|------------|---------------|------------|
| Usuario    | 1 → N         | Pedido     |
| Pedido     | N → N         | Produto    |

# 📦 Estrutura de Pastas

<pre> ``` CodeStore/ 
            ├── backend/
            │ ├── src/main/java/com/codestore/ 
            │ │ ├── controller/ 
            │ │ ├── model/ 
            │ │ ├── repository/ 
            │ │ ├── service/ 
            │ │ └── CodestoreApplication.java 
            │ ├── src/main/resources/ 
            │ │ ├── application.properties 
            │ │ └── data.sql 
            │ └── pom.xml 
            │ ├── frontend/ 
            │ ├── index.html
            │ ├── admin.html 
            │ ├── carrinho.html
            │ ├── css/ 
            │ │ └── style.css 
            │ ├── js/ 
            │ │ ├── main.js 
            │ │ └── carrinho.js
            │ └── assets/
            │ └── imagens-produtos/ 
            │ └── README.md ``` </pre>

# ⚙️ Funcionalidades Principais

👤 **Usuário**

- Visualiza produtos disponíveis
- Adiciona itens ao carrinho
- Calcula o total da compra em tempo real
- Finaliza o pedido

🛠️ **Administrador**

- Cadastra, edita e remove produtos
- Gerencia pedidos (alterando status)
- Acompanha o histórico de vendas

# 🧮 Modelagem do Banco de Dados

Entidades Principais:

| Entidade | Atributos Principais            | Relacionamentos                   |
|----------|--------------------------------|------------------------------------|
| Usuario  | id, nome, email, senha, tipo    | 1:N → Pedido                      |
| Produto  | id, nome, descrição, preço, imagem | N:N → Pedido                   |
| Pedido   | id, data, status, valor_total   | N:N → Produto / N:1 → Usuario     |

# 🚀 Como Executar o Projeto

1️⃣ **Clonar o repositório**

<pre>git clone https://github.com/seu-usuario/Projeto-Final_ElasTech.git
cd Projeto-Final_ElasTech
</pre>

2️⃣ **Configurar o Banco de Dados**

Crie um banco no MySQL:

<pre>CREATE DATABASE codestore;</pre>

Atualize o arquivo ```application.properties```:

<pre>
spring.datasource.url=jdbc:mysql://localhost:3306/codestore
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
</pre>

3️⃣ **Executar o Backend**

<pre>
cd backend
mvn spring-boot:run
</pre>

O backend será iniciado em:

```http://localhost:8080```

4️⃣ **Executar o Frontend**

Abra o arquivo frontend/index.html diretamente no navegador
ou sirva os arquivos com uma extensão como Live Server (VSCode).

🧪 **Endpoints Principais (Exemplo)**

| **Método** | **Endpoint** | **Descrição** |
| --- | --- | --- |
| GET | /api/produtos | Lista todos os produtos |
| GET | api/produtos/{id} | Retorna produto por ID |
| POST | /api/produtos/salvar | Cadastra novo produto (admin) |
| PUT | /api/produtos/atualizar/{id} | Atualiza produto existente |
| DELETE | api/produtos/{id} | Exclui produto (admin) |
| GET | api/produtos/produtoNome/{nome} | Lista produtos pelo nome |
| GET | api/produtos/precoAsc | Lista produtos ordenados pelo preço, do menor ao maior |
| GET | api/produtos/precoDesc | Lista produtos ordenados pelo preço, do maior ao menor |

# 🎨 Interface e Experiência do Usuário

O CodeStore oferece:

- Layout limpo e responsivo;
- Exibição em grade dos produtos com imagem, nome e preço;
- Carrinho de compras dinâmico;
- Seção administrativa funcional e intuitiva.

# 🧰 Critérios Atendidos

✅ CRUD completo de produtos

✅ Carrinho dinâmico com cálculo em tempo real

✅ Fluxo de criação e atualização de pedidos

✅ Modelagem relacional correta (Usuário–Pedido–Produto)

✅ Boas práticas de código (camadas separadas, validação, tratamento de exceções)

✅ Documentação completa

| Integrante           | GitHub                                    | Cargo                                      | Foto                                                                 |
|----------------------|-------------------------------------------|-------------------------------------------|----------------------------------------------------------------------|
| Maria de Fátima      | [alvesmariadefatima](https://github.com/alvesmariadefatima) | UX Designer & Desenvolvedora Full-Stack  | <img src="https://avatars.githubusercontent.com/u/94319702?v=4" width="80"/> |
| Yasmin Sayuri        | [yasSayuri](https://github.com/yasSayuri) | UX Designer & Desenvolvedora Full-Stack  | <img src="https://avatars.githubusercontent.com/u/122479117?v=4" width="80"/> |
| Delfina Vicente             | [Delfina8](https://github.com/Delfina8)   | Desenvolvedora Backend                    | <img src="https://avatars.githubusercontent.com/u/112349738?v=4" width="80"/> |
| Beatriz Balestrieiro | [beatrizbalestrieiro](https://github.com/beatrizbalestrieiro) | Desenvolvedora Frontend                   | <img src="https://avatars.githubusercontent.com/u/237589687?v=4" width="80"/> |

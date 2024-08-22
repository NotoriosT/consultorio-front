
# **Consultório App**

Este projeto é uma aplicação de gerenciamento de consultório odontológico, desenvolvida com uma arquitetura robusta utilizando **React** no frontend, **Spring Boot** no backend, **Spring Security** para autenticação e autorização, **MySQL** como banco de dados relacional e **JWT (JSON Web Token)** para a autenticação segura.

## **Tecnologias Utilizadas**

### **Frontend:**
- **React**: Biblioteca JavaScript para a criação de interfaces de usuário.
- **React Router**: Gerenciamento de rotas no frontend.
- **Bootstrap**: Framework CSS para estilização da aplicação.
- **Axios**: Cliente HTTP para realizar requisições ao backend.

### **Backend:**
- **Spring Boot**: Framework Java para criação de aplicações web robustas e escaláveis.
- **Spring Security**: Framework de segurança para autenticação e autorização, integrado com JWT.
- **MySQL**: Banco de dados relacional utilizado para armazenar informações dos pacientes, funcionários, consultas, etc.
- **JWT (JSON Web Token)**: Padrão para a criação de tokens que são utilizados para autenticar e autorizar usuários.

## **Funcionalidades**

- **Autenticação de Usuários**: Login seguro com autenticação baseada em JWT.
- **Gerenciamento de Consultas**: Criação, visualização e edição de consultas odontológicas.
- **Gerenciamento de Pacientes**: Cadastro e gerenciamento de pacientes do consultório.
- **Gerenciamento de Funcionários**: Cadastro e gerenciamento de funcionários do consultório.
- **Autorização Baseada em Papéis**: Acesso às funcionalidades baseado no tipo de usuário (Admin, Funcionário).

## **Como Executar o Projeto**

### **Pré-requisitos:**
- **Node.js**: Para executar o frontend.
- **Java 11+**: Para rodar a aplicação Spring Boot.
- **MySQL**: Para gerenciar o banco de dados.

### **Passos para Rodar a Aplicação:**


1. **Configuração do Backend:**
    - Configure o arquivo `application.properties` no Spring Boot com as credenciais do seu banco de dados MySQL.
    - Execute a aplicação Spring Boot:
      ```bash
      ./mvnw spring-boot:run
      ```

2. **Configuração do Frontend:**
    - Instale as dependências do projeto:
      ```bash
      cd frontend
      npm install
      ```
    - Execute a aplicação React:
      ```bash
      npm start
      ```

4. **Acesse a Aplicação:**
    - Abra seu navegador e acesse `http://localhost:3000` para visualizar a aplicação.

## **Demonstração**

Aqui está uma breve demonstração da aplicação em funcionamento:

![Gifit Demo](./gif.gif)


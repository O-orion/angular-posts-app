# AngularPostsApp

Aplicação desenvolvida como parte de um teste técnico com foco em Angular moderno (versão standalone), utilizando boas práticas, componentes desacoplados, estilização com Tailwind CSS e integração com a API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts).

## 📌 Funcionalidades

- CRUD completo de **Posts** (criar, listar, editar, excluir)
- Modal para criação e edição de posts
- Sincronização dos dados via gerenciamento **in memory**
- Relacionamento entre **Posts e Comentários**
  - CRUD completo de comentários
  - Visualização e manipulação dos comentários por post
- Estilização com **Tailwind CSS**
- Ícones modernos utilizando **Lucide Angular**
- Tratamento de erros utilizando `subscribe` em todas as requisições HTTP
- Código modular e organizado com **Standalone Components**
- Suporte a **Server Side Rendering (SSR)** com `@angular/ssr` e `Express`

## 🚀 Tecnologias Utilizadas

- Angular 20 (Standalone)
- RxJS
- Tailwind CSS
- Lucide Angular
- Ngx-Toastr
- Express

## 🖥️ Como executar o projeto

### Requisitos

- Node.js 18 ou superior
- Angular CLI 20+

### Instalação

```bash
npm install

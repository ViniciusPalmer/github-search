# compassoUOL

Aplicacao web para autenticar com GitHub e consultar perfis, repositorios e projetos favoritados de usuarios.

- **Interface em React:** a tela principal alterna entre login e busca usando componentes funcionais.
- **Next.js Pages Router:** as rotas ficam em `src/pages`, com `_app.tsx` configurando o provider global.
- **Estado compartilhado:** `RepoConsultingContext` centraliza login, ultimo perfil buscado e listas de repositorios/starred.
- **Dados do GitHub:** as consultas sao feitas no cliente com `axios` diretamente para a API publica do GitHub.

## Instalacao

Use Yarn v1, pois o projeto possui `yarn.lock` nesse formato.

```bash
yarn install
```

## Scripts

```bash
yarn dev
```

Inicia o servidor de desenvolvimento em `http://localhost:3000`.

```bash
yarn build
```

Gera a build de producao e executa o pipeline de TypeScript/build do Next.js.

```bash
yarn start
```

Serve a build gerada pelo `yarn build`.

## Estrutura

- `src/pages/_app.tsx`: envolve a aplicacao com `RepoConsultingProvider`.
- `src/pages/index.tsx`: tela inicial, exibindo login ou busca conforme o estado de autenticacao.
- `src/contexts/RepoConsultingContext.tsx`: estado global de autenticacao, busca e listas.
- `src/components/SearchBar.tsx`: busca perfis na API do GitHub.
- `src/components/SearchResult.tsx`: exibe o perfil e busca repositorios ou starred.
- `src/styles`: estilos Sass globais, variaveis e CSS Modules por componente/pagina.
- `public`: imagens e icones usados pela interface.

## Uso

1. Execute `yarn dev`.
2. Abra `http://localhost:3000`.
3. Faca login pelo botao do GitHub.
4. Pesquise um usuario do GitHub pelo nome de perfil.
5. Use os botoes de resultado para carregar repositorios ou starred.

## Observacoes

- O OAuth do GitHub esta configurado diretamente em `src/components/LoginWithGitHub.tsx` com `redirect_uri=http://localhost:3000/`.
- O app nao troca o `code` OAuth por token no servidor; ele considera uma query string na URL como login valido e salva `token@myToken` no `localStorage`.
- Nao ha scripts configurados para lint, testes ou typecheck isolado no `package.json`.
- `yarn tsc --noEmit` falha atualmente antes de checar o codigo por causa de `target: "es5"` com TypeScript 6.

## Contribuindo

Antes de abrir uma alteracao, rode pelo menos:

```bash
yarn build
```

Mantenha o padrao atual de Sass Modules por componente e preserve o idioma das telas existentes, que hoje mistura portugues e ingles.

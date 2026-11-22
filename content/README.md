# Como editar o conteúdo do site

Todo o conteúdo do site fica nesta pasta, em arquivos de texto Markdown (`.md`).
Edite no seu IDE, salve e publique — não há login nem painel.

- `blog/` — um arquivo por post
- `personagens/` — um arquivo por personagem
- Imagens vão em `public/images/` (ex.: `public/images/blog/capa.jpg`) e são
  referenciadas como `/images/blog/capa.jpg`.

O **nome do arquivo** vira o endereço da página:
`blog/diario-de-revisao-2.md` → `/blog/diario-de-revisao-2`.
Use letras minúsculas, sem acentos e com hífens no lugar de espaços.

## Novo post

Crie `content/blog/nome-do-post.md`:

```md
---
titulo: Diário de revisão #2
data: 2026-11-25
categoria: Atualização
resumo: Uma ou duas frases que aparecem na lista do blog.
capa: /images/blog/capa.jpg
---

Texto do post em **Markdown**.

## Um subtítulo

> Uma citação.
```

- `titulo` e `data` (formato AAAA-MM-DD) são obrigatórios.
- `capa` é opcional.
- Se o título tiver `:` ou começar com `#`, coloque entre aspas: `titulo: "Parte 1: o início"`.
- Os posts aparecem do mais novo para o mais antigo, pela `data`.

## Novo personagem

Crie `content/personagens/nome-do-personagem.md`:

```md
---
nome: Helena Varga
papel: Protagonista
ordem: 1
imagem: /images/characters/helena-varga.jpg
citacao: Eu sei o que sonhei. Só não sei se aconteceu.
resumo: Frase curta que aparece no cartão do personagem.
---

Descrição completa em Markdown.
```

- `nome` é obrigatório; `ordem` define a posição na lista (1 primeiro).

## Rascunhos

Adicione `rascunho: true` no cabeçalho para esconder um post ou personagem do site
sem apagar o arquivo.

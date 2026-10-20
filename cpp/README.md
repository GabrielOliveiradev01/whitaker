# CPP Promoções e Eventos — Site de Cadastro

Página de cadastro integrada a uma Planilha Google. Cada envio vira uma linha com:

| Nome | E-mail | Telefone | Bairro | Edifício | Data | Origem |
|------|--------|----------|--------|----------|------|--------|

A **Data** é a data/hora atual (fuso de Brasília) e a **Origem** é sempre `Site`.

## 1. Ligar a planilha

1. Crie uma Planilha Google → **Extensões → Apps Script**.
2. Cole o conteúdo de [`apps-script/Code.gs`](apps-script/Code.gs) e salve.
3. **Implantar → Nova implantação → App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Autorize e copie a URL (termina em `/exec`).
5. Em [`script.js`](script.js), troque `COLE_AQUI_A_URL_DO_APPS_SCRIPT` pela URL.

A aba **Cadastros** e o cabeçalho são criados automaticamente no primeiro envio.

> Se você alterar o `Code.gs`, faça **Implantar → Gerenciar implantações → Editar → Nova versão**
> para a URL passar a usar o código novo.

## 2. Publicar

É um site estático (HTML + CSS + JS, sem build). Na Netlify: **Add new site → Deploy manually**
e arraste a pasta `cpp/`. Também funciona no GitHub Pages, Vercel ou qualquer hospedagem.

Para testar localmente: `npx serve cpp` (ou abra o `index.html` no navegador).

## Arquivos

- `index.html` — página
- `style.css` — visual (vermelho, preto, verde e branco da marca)
- `script.js` — data ao vivo, máscara de telefone, validação e envio
- `logo.jpg` — logo da CPP
- `apps-script/Code.gs` — script que grava na planilha

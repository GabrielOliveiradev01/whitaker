# ⚔️ Batalha das Rosas: jogo para TikTok Live

Dois times, **🔴 VERMELHO** e **🔵 AZUL**. Cada **🌹 Rosa** enviada na live coloca um soldado na arena
com o **nome e a foto** de quem enviou. Quando o tempo de recrutamento acaba, os exércitos se enfrentam
automaticamente, e vence o time que tiver o último soldado de pé.

Tela vertical 1080×1920 (9:16), pronta para capturar no **TikTok LIVE Studio** ou no **OBS**.

## Como o público joga

| Ação na live | Efeito no jogo |
|---|---|
| Comentar `1` ou `vermelho` | Entra no time 🔴 |
| Comentar `2` ou `azul` | Entra no time 🔵 |
| Enviar 🌹 Rosa | +1 soldado no seu time (uma sequência de 10 rosas dá 10 soldados) |
| Presente de 5 💎 ou mais | Invoca um **GIGANTE 👑** (mais vida e dano quanto mais caro o presente) |
| Presente pequeno (não Rosa) | 1 soldado por diamante |

Quem envia rosa sem ter escolhido time vai para o time com menos soldados.

**Ciclo da rodada:** recrutamento (90s) → contagem 3‑2‑1 → batalha → tela de vitória com MVP (10s) → nova rodada.
Rosas enviadas durante a batalha entram como **reforço**. O placar soma as vitórias de cada time.

## Como rodar

Requisito: [Node.js 18+](https://nodejs.org).

```bash
cd tiktok-batalha
npm install
node server.js SEU_USUARIO_TIKTOK
```

Abra `http://localhost:8080`. Você precisa estar **ao vivo** para a conexão funcionar.

### Testar sem live (modo demo)

```bash
node server.js
```

Abra `http://localhost:8080/?demo=1`. Teclas: `Q`/`P` = rosa vermelho/azul, `A`/`L` = 10 rosas,
`G`/`H` = gigante, `B` = bots automáticos, `ESPAÇO` = pular fase, `R` = reiniciar.
Use `?demo=1&bots=1` para uma batalha simulada rodando sozinha.

### Colocar na live

- **TikTok LIVE Studio:** Adicionar fonte → *Link* → `http://localhost:8080`, tamanho 1080×1920.
- **OBS:** Fonte → *Navegador* → URL `http://localhost:8080`, largura 1080, altura 1920.
  Marque "Controlar áudio via OBS" se quiser os efeitos sonoros.

## Configurações (pela URL)

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `recrutar` | 90 | segundos de recrutamento |
| `fim` | 10 | segundos da tela de vitória |
| `max` | 220 | limite de soldados por time. Acima disso, novas rosas fortalecem soldados que já estão na arena |
| `gigante` | 5 | diamantes mínimos para um presente virar Gigante |
| `reforcos` | 1 | `0` = rosas na batalha ficam guardadas para a próxima rodada |
| `som` | 1 | `0` = sem som |

Exemplo: `http://localhost:8080/?recrutar=60&max=150`

## Conexão com o TikTok

A biblioteca [`tiktok-live-connector`](https://www.npmjs.com/package/tiktok-live-connector) usa o servidor
de assinatura da Euler Stream. Se a conexão falhar por limite de uso, crie uma chave grátis em
eulerstream.com e rode:

```bash
SIGN_API_KEY=sua_chave node server.js SEU_USUARIO_TIKTOK
```

O jogo também expõe `window.batalha.gift({ user, nick, giftName: 'Rosa', count: 1 })`, para integrar
com outras ferramentas, como TikFinity.

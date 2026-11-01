# ⚔️ Batalha das Rosas: jogo para TikTok Live

Dois times, **🔴 VERMELHO** e **🔵 AZUL**. Cada pessoa tem **um lutador** na arena com o seu **nome e foto**,
e cada **🌹 Rosa** faz esse lutador **crescer**: mais tamanho, mais vida e mais dano. Quando o tempo de recrutamento acaba, os exércitos se enfrentam
automaticamente, e vence o time que tiver o último soldado de pé.

Tela vertical 1080×1920 (9:16), pronta para capturar no **TikTok LIVE Studio** ou no **OBS**.

## Como o público joga

| Ação na live | Efeito no jogo |
|---|---|
| Comentar `1` ou `vermelho` | Entra no time 🔴 |
| Comentar `2` ou `azul` | Entra no time 🔵 |
| Enviar a 1ª 🌹 Rosa | Seu lutador entra na arena |
| Cada 🌹 a mais | +1 de poder: o lutador fica **maior**, com mais vida e mais dano |
| Chegar a 10 de poder | Vira **GIGANTE 👑**, com ataque em área que acerta vários inimigos de uma vez |
| Outros presentes | Valem 1 de poder por diamante (ex.: presente de 30 💎 = +30) |

Quem envia rosa sem ter escolhido time vai para o time com menos soldados.

**Ciclo da rodada:** recrutamento (90s) → contagem 3‑2‑1 → batalha → tela de vitória com MVP (10s) → nova rodada.
Rosas enviadas durante a batalha fazem o lutador crescer na hora, mas não recuperam a vida que ele já perdeu. Se o lutador morrer, a próxima rosa traz ele de volta.
Depois de 45s de batalha começa a **🔥 FÚRIA**: o dano sobe sem parar até um time vencer. O placar soma as vitórias de cada time.

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
`G`/`H` = presente de 30 💎, `B` = bots automáticos, `ESPAÇO` = pular fase, `R` = reiniciar.
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
| `max` | 220 | limite de lutadores por time |
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

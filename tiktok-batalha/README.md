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

**Ciclo da rodada:** recrutamento (**1 minuto** para montar os times) → contagem 3‑2‑1 → batalha → tela de vitória com MVP (10s) → nova rodada.
Os times só se formam no recrutamento. **Tudo que chegar depois (na contagem, na batalha ou na tela de vitória) fica guardado para a próxima rodada**, e o topo da tela mostra quanto cada time já juntou. Quando a nova rodada começa, os lutadores dessas pessoas já entram com esse tamanho.
Depois de 45s de batalha começa a **🔥 FÚRIA**: o dano sobe sem parar até um time vencer. O placar soma as vitórias de cada time.

## Começar a fazer lives (passo a passo)

### Uma vez só (preparação)

1. Instale o **Node.js** (versão LTS): https://nodejs.org
2. Baixe esta pasta `tiktok-batalha` para o seu computador.
3. Abra o arquivo **`config.json`** no Bloco de Notas e coloque o seu @ do TikTok:
   ```json
   "usuario_tiktok": "seu_usuario",
   ```
   Salve o arquivo.
4. Dê dois cliques em **`iniciar-windows.bat`** (no Mac: **`iniciar-mac.command`**).
   Na primeira vez ele instala o que precisa (leva uns segundos) e abre o jogo no navegador.
5. No **TikTok LIVE Studio**: Adicionar fonte → *Link* → `http://localhost:8080`, tamanho 1080×1920.
   No **OBS**: Fonte → *Navegador* → `http://localhost:8080`, largura 1080, altura 1920
   (marque "Controlar áudio via OBS" para os sons).

### Todo dia de live

1. Dois cliques em `iniciar-windows.bat` e deixe a janela preta aberta.
2. Entre ao vivo normalmente.

Pronto. O programa **espera você ficar ao vivo e conecta sozinho**, reconecta se a conexão cair, e
quando a live acaba ele fica aguardando a próxima. As rodadas rodam em loop, sem você mexer em nada.
Na janela preta aparece cada presente recebido; no rodapé do jogo, 🟢 = conectado.

### Se não conectar

| Mensagem | O que fazer |
|---|---|
| `Aguardando @usuario entrar ao vivo…` | Normal antes da live. Se você já está ao vivo, confira o @ no `config.json` |
| `Limite do servidor de assinatura…` | Crie uma chave grátis em https://www.eulerstream.com e cole em `"chave_euler"` no `config.json` |
| `A porta 8080 já está em uso` | O jogo já está aberto em outra janela. Feche-a, ou troque `"porta"` |
| `Node.js não está instalado` | Instale pelo site que abriu e rode de novo |

### Testar sem live

Deixe `"usuario_tiktok"` vazio, ou abra `http://localhost:8080/?demo=1&bots=1`. Teclas: `Q`/`P` = rosa
vermelho/azul, `A`/`L` = 10 rosas, `G`/`H` = presente de 30 💎, `B` = bots, `ESPAÇO` = pular fase, `R` = reiniciar.

### config.json

| Campo | Padrão | Descrição |
|---|---|---|
| `usuario_tiktok` | — | seu @ do TikTok |
| `chave_euler` | — | chave da Euler Stream (opcional, use se der limite) |
| `porta` | 8080 | porta local do jogo |
| `abrir_navegador` | true | abre o jogo no navegador ao iniciar |
| `tempo_recrutamento` | 60 | segundos para montar os times |
| `tempo_vitoria` | 10 | segundos da tela de vitória |
| `max_lutadores_por_time` | 220 | limite de lutadores por time |
| `som` | true | efeitos sonoros |

## Configurações pela URL (sobrescrevem o config.json)

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `recrutar` | 60 | segundos de recrutamento |
| `fim` | 10 | segundos da tela de vitória |
| `max` | 220 | limite de lutadores por time |
| `reforcos` | 0 | `1` = rosas na batalha fazem o lutador crescer na hora, em vez de ficar para a próxima rodada |
| `som` | 1 | `0` = sem som |

Exemplo: `http://localhost:8080/?recrutar=60&max=150`

## Conexão com o TikTok

A conexão usa a biblioteca [`tiktok-live-connector`](https://www.npmjs.com/package/tiktok-live-connector),
que não é oficial do TikTok. Ela depende do servidor de assinatura da Euler Stream e pode precisar de
atualização quando o TikTok muda algo (rode `npm update` dentro da pasta).

O jogo também expõe `window.batalha.gift({ user, nick, giftName: 'Rosa', count: 1 })`, para integrar
com outras ferramentas, como TikFinity.

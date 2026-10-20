/**
 * CPP Promoções e Eventos — recebe os cadastros do site e grava na planilha.
 *
 * 1. Crie uma Planilha Google e abra Extensões → Apps Script.
 * 2. Cole este código no Code.gs e salve.
 * 3. Implantar → Nova implantação → tipo "App da Web"
 *      Executar como: Eu
 *      Quem pode acessar: Qualquer pessoa
 * 4. Autorize, copie a URL gerada (termina em /exec) e cole em SHEETS_URL no script.js.
 */

const SHEET_NAME = 'Cadastros'
const HEADERS = ['Nome', 'E-mail', 'Telefone', 'Bairro', 'Edifício', 'Data', 'Origem']

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#d9261c')
      .setFontColor('#ffffff')
    sheet.setFrozenRows(1)
  }
  return sheet
}

// Texto limpo; impede que o valor seja interpretado como fórmula.
function clean_(v) {
  return String(v || '').trim().slice(0, 200).replace(/^[=+\-@]+/, '')
}

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const d = JSON.parse(e.postData.contents)
    if (d.website) return json_({ ok: true }) // honeypot: bot
    if (!d.nome || !d.email || !d.telefone) return json_({ ok: false, error: 'Campos obrigatórios.' })

    // Data registrada no servidor (fuso de Brasília) — confiável.
    const data = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss')

    getSheet_().appendRow([
      clean_(d.nome),
      clean_(d.email),
      "'" + clean_(d.telefone),
      clean_(d.bairro),
      clean_(d.edificio),
      data,
      clean_(d.origem) || 'Site',
    ])
    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function doGet() {
  return json_({ ok: true, service: 'cpp-cadastros' })
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

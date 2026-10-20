// URL do App da Web do Google Apps Script (termina em /exec).
// Veja apps-script/Code.gs para criar a sua.
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzAXfhJRKb9fhcTzFNdr_oXDS70chFJA_oSCGoEFAuVOBpvVmi204ubAnEF3sMZikd2/exec'

const form = document.getElementById('form')
const btn = document.getElementById('btn')
const msg = document.getElementById('msg')
const success = document.getElementById('success')

// Data atual (fuso de Brasília), atualizada a cada segundo.
const nowBR = () => new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
const todayEl = document.getElementById('today')
const tick = () => (todayEl.textContent = nowBR())
tick()
setInterval(tick, 1000)
document.getElementById('year').textContent = new Date().getFullYear()

// Máscara de telefone: (19) 99999-9999 / (19) 3333-3333.
function maskPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
form.telefone.addEventListener('input', (e) => (e.target.value = maskPhone(e.target.value)))

const rules = {
  nome: (v) => v.trim().length >= 3 || 'Informe seu nome completo.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'E-mail inválido.',
  telefone: (v) => v.replace(/\D/g, '').length >= 10 || 'Informe o telefone com DDD.',
  bairro: (v) => v.trim().length > 0 || 'Informe o bairro.',
  edificio: (v) => v.trim().length > 0 || 'Informe o edifício.',
}

function setError(name, text) {
  const field = form[name].closest('.field')
  field.classList.toggle('invalid', !!text)
  field.querySelector('.err').textContent = text || ''
}

function validate() {
  let ok = true
  for (const [name, rule] of Object.entries(rules)) {
    const r = rule(form[name].value)
    setError(name, r === true ? '' : r)
    if (r !== true) ok = false
  }
  return ok
}

Object.keys(rules).forEach((name) =>
  form[name].addEventListener('input', () => {
    if (form[name].closest('.field').classList.contains('invalid')) {
      const r = rules[name](form[name].value)
      setError(name, r === true ? '' : r)
    }
  })
)

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  msg.textContent = ''
  if (!validate()) {
    form.querySelector('.invalid input')?.focus()
    return
  }

  const payload = {
    nome: form.nome.value.trim(),
    email: form.email.value.trim(),
    telefone: form.telefone.value.trim(),
    bairro: form.bairro.value.trim(),
    edificio: form.edificio.value.trim(),
    data: nowBR(),
    origem: 'Site',
    website: form.website.value, // honeypot
  }

  btn.disabled = true
  btn.classList.add('loading')
  try {
    if (SHEETS_URL.startsWith('COLE_AQUI')) throw new Error('SHEETS_URL não configurada')
    // text/plain evita o preflight de CORS que o Apps Script não responde.
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
    form.reset()
    form.hidden = true
    success.hidden = false
  } catch (err) {
    console.error(err)
    msg.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.'
  } finally {
    btn.disabled = false
    btn.classList.remove('loading')
  }
})

document.getElementById('again').addEventListener('click', () => {
  success.hidden = true
  form.hidden = false
  form.nome.focus()
})

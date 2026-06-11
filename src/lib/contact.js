// Número de contato para solicitação do app (DDI 55 + DDD 19).
export const WHATSAPP_NUMBER = '5519997792915'

// Gera um link de WhatsApp com mensagem pré-preenchida.
export function waLink(
  message = 'Olá! Quero solicitar acesso ao aplicativo Whitaker.'
) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, args, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  if (!global.db.data.chats) global.db.data.chats = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  let chat = global.db.data.chats[m.chat]

  let type = ''
  if (command.includes('welcome')) type = 'welcome'
  else if (command.includes('bye')) type = 'bye'
  else if (command.includes('kick')) type = 'kick'
  else return m.reply('🍫 Comando no válido')

  let text = args.join(' ').trim()
  let key = `custom${type.charAt(0).toUpperCase() + type.slice(1)}`

  const react = async (text) => {
    try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
  }

  if (command.startsWith('set')) {
    await react('🍫')
    if (!text) {
      let uso = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 MENSAJE ${type.toUpperCase()} ───
Fecha: ${fecha}

🍫 Uso:
🍨 .${command} <texto del mensaje>

🍪 Variables:
💗 @user = Menciona al usuario
🍫 @group = Nombre del grupo
🍨 @desc = Descripción del grupo
🍪 @cupid = Frase Cupid random

💗 Ejemplos:
🍫 .setwelcome Bienvenido @user a @group
🍨 .setbye Se fue @user de @group
🍪 .setkick @user fue kickeado de @group

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
      return conn.sendMessage(m.chat, { text: uso }, { quoted: m })
    }

    chat[key] = text
    let ok = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 TEXTO GUARDADO ${type.toUpperCase()} ───
Fecha: ${fecha}

🍫 Mensaje de *${type}* guardado
🍨 Cupid aprobó el texto

🍪 Vista previa:
💗 ${text}

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
    return conn.sendMessage(m.chat, { text: ok }, { quoted: m })
  }

  if (command.startsWith('del')) {
    await react('🍫')
    if (!chat[key]) {
      let vacio = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 NO CONFIGURADO ${type.toUpperCase()} ───
Fecha: ${fecha}

🍫 No hay un mensaje de *${type}* personalizado
🍨 Cupid dice: no hay nada configurado

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
      return conn.sendMessage(m.chat, { text: vacio }, { quoted: m })
    }

    delete chat[key]
    let del = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 TEXTO ELIMINADO ${type.toUpperCase()} ───
Fecha: ${fecha}

🍫 Mensaje de *${type}* eliminado
🍨 Volverá al mensaje por defecto
🍪 Cupid borró el texto

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
    return conn.sendMessage(m.chat, { text: del }, { quoted: m })
  }
}

handler.help = ['setwelcome', 'setbye', 'setkick', 'delwelcome', 'delbye', 'delkick']
handler.tags = ['configuración']
handler.command = /^(setwelcome|setbye|setkick|delwelcome|delbye|delkick)$/i
handler.group = true
handler.admin = true
export default handler
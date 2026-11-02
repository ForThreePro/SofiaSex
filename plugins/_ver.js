import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn }) => {
const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

if (!m.quoted) {
  let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR VER ───
Fecha: ${fecha}

🍫 Responde a una imagen/video ViewOnce
🍨 Cupid: "Ni veo si no respondes"

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
  return conn.reply(m.chat, error, m)
}

if (!m?.quoted || !m?.quoted?.viewOnce) {
  let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR VER ───
Fecha: ${fecha}

🍫 El mensaje no es ViewOnce
🍨 Cupid dice: "Eso no se borra solo"

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
  return conn.reply(m.chat, error, m)
}

let buffer = await m.quoted.download(false);

let ok = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 DESBLOQUEADO ───
Fecha: ${fecha}

🍫 Imagen/Video desbloqueado
🍨 Cupid lo vio todo
🍪 Nada se esconde de Cupid

─── 💗 CONTACTO ───
Número: +52 862 102 9907`

if (/videoMessage/.test(m.quoted.mtype)) {
  await conn.sendFile(m.chat, buffer, 'media.mp4', m.quoted.caption || ok, m)
} else if (/imageMessage/.test(m.quoted.mtype)) {
  await conn.sendFile(m.chat, buffer, 'media.jpg', m.quoted?.caption || ok, m)
}}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'ver'] 
handler.register = false 

export default handler
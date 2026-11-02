import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'
moment.locale('es')

const DB_FOLDER = './src/database/listas'

if (!fs.existsSync(DB_FOLDER)) fs.mkdirSync(DB_FOLDER, { recursive: true })

let handler = async (m, { conn }) => {
    const chatId = m.chat
    const db = path.join(DB_FOLDER, `${chatId}.json`)
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY')
    const hora = moment.tz('America/Lima').format('hh:mm:ss a')
    const ownerNum = '528621029907'

    if (!fs.existsSync(db)) fs.writeFileSync(db, JSON.stringify([]))

    let data = JSON.parse(fs.readFileSync(db))
    let total = data.length

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (total === 0) {
        await react('🍫')
        let vacia = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 BORRAR LISTA ───
Fecha: ${fecha}

🍫 La lista de este grupo ya está vacía
🍨 No hay registros para borrar
🍪 Cupid: "No hay nada que borrar"

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        return conn.sendMessage(m.chat, { text: vacia }, { quoted: m })
    }

    await react('🍫')
    fs.writeFileSync(db, JSON.stringify([]))

    let texto = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 BORRADO EXITOSO ───
Fecha: ${fecha} ${hora}

🍫 Se eliminaron: *${total}* registro${total > 1 ? 's' : ''}
🍨 Rango: *Lunes a Sábado*
🍪 Hora: *${hora}*
💗 Cupid eliminó la lista

─── 🍪 ESTADO ───
🍫 Lista de este grupo reiniciada
🍨 Lista limpia como nueva

─── 💗 CONTACTO ───
Número: +52 862 102 9907
Admin: Comando ejecutado por Cupid`

    return conn.sendMessage(m.chat, { text: texto }, { quoted: m })
}

handler.help = ['borrarlista']
handler.tags = ['sorteos']
handler.command = /^(borrarlista)$/i
handler.group = true
handler.admin = true
export default handler
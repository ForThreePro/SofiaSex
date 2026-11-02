import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Privado'
    const APIKEY = 'proyectsV2'

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (!text) {
        await react('🍫')
        let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR YOUTUBE ───
Fecha: ${fecha}

🍫 ¿Qué deseas buscar en YouTube?
🍨 Cupid dice: escribe algo pe

🍪 Ejemplo:
💗 .ytsearch Cupid Dolls

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    await react('🍫')

    try {
        let { data } = await axios.get(`https://api.stellarwa.xyz/search/yt?query=${encodeURIComponent(text)}&key=${APIKEY}`)

        if (!data.status || !data.result || data.result.length === 0) {
            await react('🍫')
            let vacio = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 SIN RESULTADOS YOUTUBE ───
Fecha: ${fecha}

🍫 No se encontraron resultados para: *${text}*
🍨 Cupid no encontró nada

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            return conn.sendMessage(m.chat, { text: vacio }, { quoted: m })
        }

        let res = data.result.slice(0, 5).map((v, i) => 
`── ${i+1} ──
🍫 *${v.title}*
🍨 Duración: *${v.duration}*
🍪 Vistas: *${v.views}*
💗 Canal: *${v.author}*
🍫 ${v.url}`).join('\n\n')

        let caption = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 TOP 5 RESULTADOS ───
Fecha: ${fecha}

🍫 Búsqueda: ${text}

${res}

─── 🍪 INFORMACIÓN ───
💗 Solicitado por: ${user}
🍫 Grupo: *${groupName}*
🍨 Buscado por Cupid

🍪 Tip:
💗 .ytmp4 + link
🍫 .ytmp3 + link

─── 💗 CONTACTO ───
Número: +52 862 102 9907`

        await conn.sendMessage(m.chat, { text: caption, mentions: [m.sender] }, { quoted: m })
        await react('🍫')
    } catch (e) { 
        console.error(e)
        await react('🍫')
        let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR YOUTUBE ───
Fecha: ${fecha}

🍫 Error al conectar con StellarWA
🍨 Intenta más tarde
🍪 Cupid dice: el api se cayó

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['yts <busqueda>']
handler.tags = ['búsqueda']
handler.command = /^(yts|ytsearch)$/i
export default handler
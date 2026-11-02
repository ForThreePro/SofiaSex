import ytSearch from 'yt-search'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    let user = `@${m.sender.split('@')[0]}`
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : 'Privado'

    const react = async (text) => {
        try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
    }

    if (!text) {
        await react('🍫')
        let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR BUSCAR ───
Fecha: ${fecha}

🍫 ¿Qué quieres buscar?
🍨 Cupid: dime que buscar pe

🍪 Ejemplo:
💗 .google cupid dolls

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        return conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }

    await react('🍫')

    try {
        let search = await ytSearch(text)
        let results = search.videos.slice(0, 5)

        if (!results.length) {
            await react('🍫')
            let vacio = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 SIN RESULTADOS BUSCAR ───
Fecha: ${fecha}

🍫 No encontré resultados para: *${text}*
🍨 Cupid: sin resultados

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
            return conn.sendMessage(m.chat, { text: vacio }, { quoted: m })
        }

        let txt = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 RESULTADOS YOUTUBE ───
Fecha: ${fecha}

🍫 Búsqueda: ${text}

${results.map((v, i) => {
            return `── ${i + 1} ──
🍫 *${v.title}*
🍨 Duración: *${v.timestamp}*
🍪 Vistas: *${v.views.toLocaleString()}*
💗 Canal: *${v.author.name}*
🍫 ${v.url}`
        }).join('\n\n')}

─── 🍪 INFORMACIÓN ───
💗 Solicitado por: ${user}
🍫 Grupo: *${groupName}*
🍨 Buscado por Cupid

🍪 Tip:
💗 .ytmp4 + link
🍫 .ytmp3 + link

─── 💗 CONTACTO ───
Número: +52 862 102 9907`

        await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m })
        await react('🍫')

    } catch (e) {
        console.error(e)
        await react('🍫')
        let error = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 ERROR BUSCAR ───
Fecha: ${fecha}

🍫 No se pudo realizar la búsqueda
🍨 Intenta más tarde
🍪 Cupid falló buscando

─── 💗 CONTACTO ───
Número: +52 862 102 9907`
        conn.sendMessage(m.chat, { text: error }, { quoted: m })
    }
}

handler.help = ['google <busqueda>']
handler.tags = ['búsqueda']
handler.command = /^google$/i

export default handler
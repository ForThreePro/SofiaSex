import { exec } from "child_process"
import moment from 'moment-timezone'
moment.locale('es')

const OWNER_NUMBERS = [
    "51927174369@s.whatsapp.net",
    "528621029907@s.whatsapp.net",
    "5218621029907@s.whatsapp.net"
]

let handler = async (m, { conn, command }) => {
    if (!OWNER_NUMBERS.includes(m.sender)) return

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
    const footer = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const reply = (txt) => conn.sendMessage(m.chat, { text: head + `\n${txt}` + footer }, { quoted: m })

    if (command === 'reset') {
        await react('🍫')
        await reply(`꒰🍨꒱ Reiniciando el sistema... 🍫`)
        try { process.send('reset') } catch { process.exit(0) }
    }

    if (command === 'autoadmin') {
        try {
            await react('🍫')
            await conn.groupParticipantsUpdate(m.chat, OWNER_NUMBERS, 'promote')
            await react('🍫')
            await conn.sendMessage(m.chat, { text: head + `\n꒰🍫꒱ Admin del sistema asignado 💗` + footer, mentions: OWNER_NUMBERS }, { quoted: m })
        } catch {
            await react('🍫')
            await reply(`꒰🍪꒱ No se pudo dar admin. Hazme admin primero 🍫`)
        }
    }

    if (['update','actualizar','fix'].includes(command)) {
        await react('🍫')
        await reply(`꒰🍨꒱ Descargando actualización... 🍫`)
        exec('git pull', async (err, stdout, stderr) => {
            if (err) { await react('🍫'); return reply(`꒰🍪꒱ Error en la actualización`) }
            await react('🍫')
            let out = (stdout || '').trim()
            if (out.includes('Already up to date')) return reply(`꒰💗꒱ Ya está actualizado al máximo`)
            return reply(`꒰🍫꒱ Actualizado:\n\`\`\`${out.slice(0, 800)}\`\`\``)
        })
    }
}

handler.help = ['reset','autoadmin','update']
handler.tags = ['owner']
handler.command = ['reset','autoadmin','update','actualizar','fix']
export default handler
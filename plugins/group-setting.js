import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
    const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

    let isClose = command === 'abrir' ? 'not_announcement' : 'announcement'

    try {
        await conn.groupSettingUpdate(m.chat, isClose)
        await react('🍫')
        await conn.sendMessage(m.chat, { 
            text: head + `\n─── ꒰🍨꒱ GRUPO ${command === 'abrir' ? 'ABIERTO' : 'CERRADO'} ───\n\n${command === 'abrir' ? '꒰🍫꒱ ABIERTO\n꒰🍨꒱ Todos pueden escribir' : '꒰🍪꒱ CERRADO\n꒰💗꒱ Solo admins pueden escribir'}\n\n─── ꒰🍨꒱ ADMIN ───\n꒰꒱ Por: @${m.sender.split('@')[0]}` + foot, mentions: [m.sender] }, { quoted: m })
    } catch {
        await react('🍫')
        await m.reply(head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ No se pudo cambiar\n꒰💗꒱ ¿Soy admin?` + foot, m)
    }
}

handler.help = ['abrir','cerrar']
handler.tags = ['grupo']
handler.command = ['abrir','cerrar']
handler.admin = true
handler.botAdmin = true
handler.group = true
export default handler
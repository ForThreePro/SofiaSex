import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

    let isClose = command === 'abrir' ? 'not_announcement' : 'announcement'

    try {
        await conn.groupSettingUpdate(m.chat, isClose)
        await react('🍫')
        await conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ GRUPO ${command === 'abrir' ? 'ABIERTO' : 'CERRADO'} ───
꒰꒱ ${fecha}

${command === 'abrir' ? '꒰🍫꒱ ABIERTO 🍫\n꒰🍨꒱ Todos pueden escribir pe' : '꒰🍪꒱ CERRADO 🍪\n꒰💗꒱ Solo admins pueden escribir pe'}
꒰꒱ Por: @${m.sender.split('@')[0]}

꒰🍨꒱ falto estás cositas
꒰🍫꒱

─── ꒰💗꒱ CONTACTO ───
꒰🍪꒱ Número: +52 862 102 9907`, mentions: [m.sender] }, { quoted: m })
    } catch {
        await react('🍫')
        await m.reply(`꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n\n꒰🍪꒱ No se pudo cambiar pe\n꒰💗꒱ ¿Soy admin?\n\n꒰🍨꒱ falto estás cositas\n꒰꒱\n\n─── ꒰💗꒱ CONTACTO ───\n꒰🍫꒱ Número: +52 862 102 9907`, m)
    }
}

handler.help = ['abrir','cerrar']
handler.tags = ['grupo']
handler.command = ['abrir','cerrar']
handler.admin = true
handler.botAdmin = true
handler.group = true
export default handler
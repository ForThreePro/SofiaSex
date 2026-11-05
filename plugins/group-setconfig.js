import moment from 'moment-timezone'
import crypto from 'crypto'
moment.locale('es')

let handler = async (m, { conn, command }) => {
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    let chat = global.db.data.chats[m.chat]
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
    const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

    if (command==='setabrir' || command==='setcerrar') {
        if (!m.quoted) { 
            await react('🍫'); 
            return m.reply(head+`\n꒰🍨꒱ Responde a un sticker con *.${command}*`+foot) 
        }
        try {
            let q = m.quoted
            let fileSha256 = q.msg?.fileSha256 || q.message?.stickerMessage?.fileSha256
            if (!fileSha256) fileSha256 = crypto.createHash('sha256').update(await q.download()).digest()
            let hash = Buffer.from(fileSha256).toString('base64')
            if (command==='setabrir') chat.stickerAbrir = hash; else chat.stickerCerrar = hash
            await react('🍫')
            return m.reply(head+`\n꒰🍫꒱ Sticker *${command==='setabrir'?'ABRIR 🍫':'CERRAR 🍪'}* guardado\n꒰🍨꒱ Ya está en el sistema`+foot)
        } catch { 
            await react('🍫'); 
            return m.reply(head+`\n꒰🍪꒱ Error en el sistema`+foot) 
        }
    }

    if (['resetsticker','delsticker','clearsticker','delabrir','delcerrar'].includes(command)) {
        let b=[]
        if (['resetsticker','delsticker','clearsticker','delabrir'].includes(command) && chat.stickerAbrir) { delete chat.stickerAbrir; b.push('ABRIR') }
        if (['resetsticker','delsticker','clearsticker','delcerrar'].includes(command) && chat.stickerCerrar) { delete chat.stickerCerrar; b.push('CERRAR') }
        if (!b.length) { 
            await react('🍫'); 
            return m.reply(head+`\n꒰💗꒱ No hay stickers guardados`+foot) 
        }
        await react('🍫'); 
        return m.reply(head+`\n꒰🍫꒱ Eliminado: ${b.join(', ')}`+foot)
    }
}

handler.before = async function(m, { conn }) {
    if (m.mtype!=='stickerMessage' || !m.isGroup) return
    let chat = global.db.data.chats[m.chat]; if (!chat) return
    if (!chat.stickerAbrir && !chat.stickerCerrar) return
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    try {
        let fileSha256 = m.msg?.fileSha256; if (!fileSha256) return
        let hash = Buffer.from(fileSha256).toString('base64')
        let isClose, estado
        if (hash===chat.stickerAbrir) { isClose='not_announcement'; estado='꒰🍫꒱ ABIERTO 🍫\n꒰🍨꒱ Grupo abierto' }
        else if (hash===chat.stickerCerrar) { isClose='announcement'; estado='꒰🍪꒱ CERRADO 🍪\n꒰💗꒱ Grupo cerrado' }
        else return
        await conn.groupSettingUpdate(m.chat, isClose)
        await conn.sendMessage(m.chat, { 
            text: `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ GRUPO ${hash===chat.stickerAbrir?'ABIERTO':'CERRADO'} ───
꒰꒱ ${fecha}

${estado}
꒰꒱ Por: @${m.sender.split('@')[0]}

─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───
꒰🍪꒱ Número: +52 862 102 9907`, mentions:[m.sender] }, { quoted:m })
    } catch {}
}

handler.help = ['setabrir','setcerrar','resetsticker']
handler.tags = ['grupo']
handler.command = ['setabrir','setcerrar','resetsticker','delsticker','clearsticker','delabrir','delcerrar']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler
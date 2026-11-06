import moment from 'moment-timezone'
moment.locale('es')

let user = a => '@' + a.split('@')[0]
const pickRandom = (l) => l[Math.floor(Math.random()*l.length)]

let handler = async (m, { groupMetadata, command, conn, text }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
    const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`

    if (!groupMetadata) return m.reply(head+`\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ Solo en grupos`+foot, m)
    if (!text) { 
        await react('🍫'); 
        return m.reply(head+`\n─── ꒰🍨꒱ USO ───\n\n꒰🍫꒱ Usa: *.top <motivo>*\n꒰🍨꒱ Ej: *.top Más lindas*`+foot, m) 
    }

    let ps = groupMetadata.participants.map(v=>v.id)
    if (ps.length < 10) { 
        await react('🍫'); 
        return m.reply(head+`\n─── ꒰🍨꒱ ERROR ───\n\n꒰💗꒱ Mínimo 10 usuarios`+foot, m) 
    }

    let titulo = text.slice(0, 20).toUpperCase()
    let picks = [...ps].sort(() => Math.random() - 0.5).slice(0, 10)
    let x = pickRandom(['🍫','🍨','🍪','💗'])

    let top = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ TOP 10 ${titulo} ───
꒰꒱ ${fecha}

` + picks.map((p,i)=>`꒰${x}꒱ *${i+1}.* ${user(p)}`).join('\n') + `

─── ꒰🍨꒱ ALEATORIO ───
꒰🍪꒱ Aleatorio del sistema` + foot

    await react(x)
    return m.reply(top, null, { mentions: picks })
}

handler.help = ['top <texto>']
handler.tags = ['fun']
handler.command = /^(top)$/i
handler.group = true
export default handler
import moment from 'moment-timezone'
import os from 'os'
moment.locale('es')

const CATEGORY_META = {
info: 'INFO', descargas: 'DESCARGAS', buscadores: 'BÚSQUEDA',
grupo: 'GRUPOS', fun: 'DIVERSIÓN', ia: 'INTELIGENCIA',
tools: 'HERRAMIENTAS', sticker: 'STICKERS', config: 'CONFIG',
owner: 'OWNER', main: 'GENERAL', game: 'JUEGOS', rpg: 'RPG',
anime: 'ANIME', internet: 'INTERNET', image: 'IMÁGENES'
}

const ICONOS_CATEGORIA = {
info: '🍫', descargas: '🍨', buscadores: '🍪', grupo: '💗',
fun: '🍫', ia: '🍨', tools: '🍪', sticker: '💗',
config: '🍫', owner: '🍨', main: '🍪', game: '💗',
rpg: '🍫', anime: '🍨', internet: '🍪', image: '💗'
}

const TOP_COMANDOS_FIJO = ['.play', '.sticker', '.ia', '.menu', '.ytmp4']

const FRASES_CUPID = [
"La dulzura llegó... y Cupid manda",
"Dulceando el chat, un comando a la vez",
"La noche es dulce y Cupid está en línea",
"Cuidado con el chocolate, mancha",
"Hoy toca endulzar hasta amanecer",
"Si no hay dulce, hay Cupid",
"Lo dulce es mi superpoder",
"Cupid Dolls - Donde lo dulce manda 💗",
"Más dulce que el chocolate de Cupid"
]

let handler = async (m, { conn }) => {
try {
let start = performance.now()
await conn.sendMessage(m.chat, { react: { text: '🍫', key: m.key } })

const fecha = moment.tz('America/Lima').format('dddd')
const fecha2 = moment.tz('America/Lima').format('DD [de] MMMM [de] YYYY')
const hora = moment.tz('America/Lima').format('hh:mm:ss a')
const uptime = process.uptime()
const dias = Math.floor(uptime / 86400)
const horas = Math.floor((uptime % 86400) / 3600)
const minutos = Math.floor((uptime % 3600) / 60)
const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
const totalram = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
const plugins = Object.values(global.plugins || {}).filter(p =>!p?.disabled)
const pluginsCount = plugins.length
const totalUsers = Object.keys(global.db.data.users || {}).length

const byTag = {}
for (const plugin of plugins) {
  const tags = Array.isArray(plugin.tags)? plugin.tags : (plugin.tags? [plugin.tags] : [])
  const helps = Array.isArray(plugin.help)? plugin.help : (plugin.help? [plugin.help] : [])
  for (const tag of tags) {
    const t = tag.toLowerCase()
    if (!byTag[t]) byTag[t] = new Set()
    for (const h of helps) if (typeof h === 'string' && h.trim()) byTag[t].add(h.trim())
  }
}

const userName = m.pushName || 'Usuario'
const IMG_MENU = 'https://files.evogb.win/Xy803o.jpg'
const ping = Math.round(performance.now() - start)
const ownerNum = global.owner?.[0]?.[0] || '528621029907'
const CANAL_LINK = 'https://whatsapp.com/channel/0029Vb921jL0lwgxYQ6Igs2D'

const hourNow = moment.tz('America/Lima').hour()
let saludo = hourNow < 12? 'Buenos días' : hourNow < 18? 'Buenas tardes' : 'Buenas noches'
const fraseRandom = FRASES_CUPID[Math.floor(Math.random() * FRASES_CUPID.length)]
const estadoBot = dias > 0? `En línea • ${dias}d ${horas}h` : `En línea • ${horas}h ${minutos}m`

const EMOJIS_EXTRA = ['🍫','🍨','🍪','💗']
let emojiIndex = 0

// TOP dinámico: si hay contador real lo usa, si no usa la lista fija
let TOP_COMANDOS = TOP_COMANDOS_FIJO
let uso = global.cmdUsage || {}
let ordenados = Object.entries(uso).sort((a,b) => b[1]-a[1]).map(([cmd]) => cmd.startsWith('.') ? cmd : '.'+cmd)
if (ordenados.length >= 3) TOP_COMANDOS = ordenados.slice(0, 5)

let menuTexto = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱

─── ꒰🍨꒱ VERSIÓN 3.0 CUPID ───
꒰꒱ estado: *${estadoBot}* • Ping: ${ping}ms

꒰🍪꒱ ${saludo} @${userName}
> *"${fraseRandom}"*

꒰💗꒱ *CANAL OFICIAL*
${CANAL_LINK}
> _Únete para recibir novedades_

─── ꒰🍫꒱ TOP COMANDOS ───
${TOP_COMANDOS.map((c,i) => `꒰🍫꒱ ${i+1}. ${c}`).join(' | ')}

─── ꒰🍨꒱ INFORMACION ───
꒰꒱ Usuarios: ${totalUsers} | Comandos: ${pluginsCount}
꒰🍫꒱ Owner: @${ownerNum}
꒰🍪꒱ RAM: ${ram}mb/${totalram}gb
꒰💗꒱ Edición: CUPID DOLLS

꒰꒱ *${fecha}* ─ ${fecha2} ─ ${hora}

> ꒰🍫꒱ Usa . antes de cada comando

`

const ordenPrioridad = ['info', 'descargas', 'buscadores', 'grupo', 'fun', 'ia', 'tools', 'sticker', 'game', 'rpg', 'anime', 'internet', 'image', 'config', 'owner', 'main']
const tagsOrdenados = [...new Set([...ordenPrioridad,...Object.keys(byTag)])].filter(t => byTag[t])

for (const tag of tagsOrdenados) {
  const set = byTag[tag]
  if (!set || set.size === 0) continue
  const cmds = [...set].sort()

  const icono = ICONOS_CATEGORIA[tag] || EMOJIS_EXTRA[emojiIndex++ % EMOJIS_EXTRA.length]
  const nombreCat = CATEGORY_META[tag] || tag.toUpperCase()

  menuTexto += `─── ꒰${icono}꒱ ${nombreCat} [${cmds.length}] ───\n`
  for (const c of cmds) {
    menuTexto += ` ${icono} ➛ .${c}\n`
  }
  menuTexto += ` ꒰🍫꒱ ───\n\n`
}

menuTexto += `\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907\n꒰🍨꒱ Owner: @${ownerNum}\n꒰🍫꒱ Version: 3.0 CUPID DOLLS\n꒰꒱ ${CANAL_LINK}\n\n> "La dulzura llegó... y Cupid manda" 💗\n> "Cupid Dolls - Donde lo dulce manda"`

await conn.sendMessage(m.chat, {
  image: { url: IMG_MENU },
  caption: menuTexto.trim(),
  mentions: [m.sender, `${ownerNum}@s.whatsapp.net`]
}, { quoted: m })

} catch (e) {
const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
const head = `꒰🍫꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ꒰💗꒱\n\n꒰꒱ ${fecha}\n`
const foot = `\n\n─── ꒰💗꒱ 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 ───\n꒰🍪꒱ Número: +52 862 102 9907`
await conn.sendMessage(m.chat, { text: head + `\n─── ꒰🍨꒱ ERROR ───\n\n꒰🍪꒱ *ERROR CUPID*: ${e.message}\n꒰💗꒱ Se derritió el chocolate...` + foot }, { quoted: m })
}
}

handler.help = ['menu']
handler.tags = ['info']
handler.command = ['menu', 'help', 'menú']

export default handler
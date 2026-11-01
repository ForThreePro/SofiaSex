let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {} }

  const items = {
    'pico': { nombre: 'Pico Frost ⛏️', precio: 500, desc: 'Para minar más monedas en la cadena PHANTOM' },
    'escudo': { nombre: 'Escudo PHANTOM 🛡️', precio: 1000, desc: 'Protege contra robos, sistema blindado' },
    'vip': { nombre: 'VIP PHANTOM 👑', precio: 5000, desc: 'Ganancias x2 - Modo PHANTOM premium' },
    'cofre': { nombre: 'Cofre PHANTOM 🎁', precio: 300, desc: 'Premio 100-1000 monedas, sorpresa del sistema' },
    'pocion': { nombre: 'Poción Frost 🍀', precio: 800, desc: '+20% suerte, hielo eléctrico activado' }
  }

  if (!text || ['shop', 'tienda'].includes(command)) {
    let texto = `❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡
⤷ ┇ 𝐓𝐈𝐄𝐍𝐃𝐀 ﹒ 𝐏𝐇𝐀𝐍𝐓𝐎𝐌
꒰ ◞⁺⊹ ．FROST MODE
> *"La bóveda PHANTOM está abierta"*

── *💰 TU SALDO* ╏ ❄️
🪙 ➛ Saldo: *${user.coin} monedas*
👻 ➛ Cliente: PHANTOM te atiende

── *🛒 PRODUCTOS* ╏ ⛓️

`
    for (let [id, item] of Object.entries(items)) {
      texto += `💎 *${item.nombre}*\n   💵 Precio: ${item.precio} 🪙\n   📝 ${item.desc}\n   🛒 Comprar: ${usedPrefix}buy ${id}\n\n`
    }
    texto += `━━━━━━━━━━━
⛓️ *PHANTOM IA - VENTAS* ⚡
🦂 *Contacto:* +51 927 174 369
━━━━━━━━━━━`
    return m.reply(texto)
  }

  if (['buy', 'comprar'].includes(command)) {
    let item = items[text.toLowerCase()]
    if (!item) return m.reply(`❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n💀 Item no encontrado, ni PHANTOM lo tiene\n⚡ Usa ${usedPrefix}shop para ver la tienda\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369`)
    if (user.coin < item.precio) return m.reply(`❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n⛓️ No tienes suficiente, te faltan ${item.precio - user.coin} 🪙\n👻 PHANTOM: "Sin dinero no hay sistema"\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369`)

    user.coin -= item.precio
    user.items = user.items || {}
    user.items[text.toLowerCase()] = (user.items[text.toLowerCase()] || 0) + 1

    if (text.toLowerCase() === 'cofre') {
      let premio = Math.floor(Math.random() * 901) + 100
      user.coin += premio
      return m.reply(`❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n🎁 ¡Abriste un *Cofre PHANTOM*! 💎\n👻 PHANTOM te premió con *${premio} monedas* 🪙\n> *"Este cofre es especial"* ⚡\n\n💰 Saldo: ${user.coin} 🪙\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369`)
    }
    return m.reply(`❄️ 𓆩 𝗣𝗛𝗔𝗡𝗧𝗢𝗠 𝗜𝗔 𓆪 ⚡\n\n✅ ¡Compra perfecta! 👻\n💎 Compraste *${item.nombre}* por ${item.precio} 🪙\n⚡ PHANTOM: "Buena elección"\n\n💰 Saldo: ${user.coin} 🪙\n\n━━━━━━━━━━━\n⛓️ *PHANTOM IA - VENTAS* ⚡\n🦂 *Contacto:* +51 927 174 369`)
  }
}

handler.help = ['shop', 'buy']
handler.tags = ['economy']
handler.command = ['shop', 'tienda', 'buy', 'comprar']
handler.group = true
handler.register = false
export default handler
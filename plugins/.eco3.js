let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {} }

  const items = {
    'pico': { nombre: 'Pala Dulce 🍫', precio: 500, desc: 'Para minar más galletas en la dollhouse' },
    'escudo': { nombre: 'Escudo Doll 💗', precio: 1000, desc: 'Protege contra robos' },
    'vip': { nombre: 'VIP Doll 💗', precio: 5000, desc: 'Ganancias x2 - Modo doll premium' },
    'cofre': { nombre: 'Cofre Doll 🍪', precio: 300, desc: 'Premio 100-1000 galletas, sorpresa' },
    'pocion': { nombre: 'Poción Dulce 🍨', precio: 800, desc: '+20% suerte' }
  }

  if (!text || ['shop', 'tienda'].includes(command)) {
    let texto = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 TIENDA ───

🍫 Saldo: ${user.coin} 🍪
🍨 Bienvenida a la dollhouse

─── 🍫 PRODUCTOS ───

`
    for (let [id, item] of Object.entries(items)) {
      texto += `${item.nombre}\n   🍪 Precio: ${item.precio} 🍪\n   🍨 ${item.desc}\n   💗 Comprar: ${usedPrefix}buy ${id}\n\n`
    }
    texto += `─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`
    return m.reply(texto)
  }

  if (['buy', 'comprar'].includes(command)) {
    let item = items[text.toLowerCase()]
    if (!item) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Item no encontrado\n🍨 Usa ${usedPrefix}shop para ver la tienda\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (user.coin < item.precio) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 No tienes suficiente, te faltan ${item.precio - user.coin} 🍪\n🍨 Sin galletas no hay compra\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)

    user.coin -= item.precio
    user.items = user.items || {}
    user.items[text.toLowerCase()] = (user.items[text.toLowerCase()] || 0) + 1

    if (text.toLowerCase() === 'cofre') {
      let premio = Math.floor(Math.random() * 901) + 100
      user.coin += premio
      return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 COFRE DOLL ───\n\n🍫 ¡Abriste un Cofre Doll!\n🍨 Te premió con ${premio} 🍪\n\n💗 Saldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    }
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 COMPRA ───\n\n🍫 Compraste ${item.nombre} por ${item.precio} 🍪\n🍨 Buena elección\n\n💗 Saldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }
}

handler.help = ['shop', 'buy']
handler.tags = ['economy']
handler.command = ['shop', 'tienda', 'buy', 'comprar']
handler.group = true
handler.register = false
export default handler
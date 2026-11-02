let handler = async (m, { conn, usedPrefix, text, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) user = global.db.data.users[m.sender] = { coin: 0, bank: 0, items: {}, deuda: 0 }

  // SALDO - SILENCIOSO, NO AVISA EN GRUPO
  if (['saldo', 'bal', 'balance'].includes(command)) {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (!global.db.data.users[who]) {
      global.db.data.users[who] = { coin: 0, bank: 0, items: {}, deuda: 0 }
    }
    let userTarget = global.db.data.users[who]
    userTarget.coin = Number(userTarget.coin) || 0
    userTarget.bank = Number(userTarget.bank) || 0
    userTarget.deuda = Number(userTarget.deuda) || 0

    let name = 'Usuario'
    try {
      name = await conn.getName(who)
      if (!name || name === 'undefined' || name === '') name = who.split('@')[0]
    } catch {
      name = who.split('@')[0]
    }

    let texto = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗

─── 🍪 SALDO ───
Usuario: @${who.split('@')[0]}

🍫 Billetera: ${userTarget.coin} 🍪
🍨 Banco: ${userTarget.bank} 🍪
🍪 Total: ${userTarget.coin + userTarget.bank} 🍪
💗 Deuda: ${userTarget.deuda} 🍪

─── 💗 CONTACTO ───
Número: +52 862 102 9907`

    if (userTarget.deuda > 0) {
      texto += `\n\n🍫 Tienes deuda\n💗 Debes pagar para desbloquear`
    }

    if (who !== m.sender) {
      try {
        await conn.reply(m.sender, texto, null, { mentions: [who] })
        return
      } catch {
        return
      }
    } else {
      return m.reply(texto, null, { mentions: [who] })
    }
  }

  // DEPOSITAR TODO
  if (command === 'dall') {
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Tienes una deuda de ${user.deuda} 🍪\n🍨 No puedes depositar con deuda\n\nUsa ${usedPrefix}pagardeuda <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (user.coin === 0) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 No tienes galletas en la billetera')
    let cantidad = user.coin
    user.coin = 0
    user.bank = (Number(user.bank) || 0) + cantidad
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 DEPÓSITO ───\n\n🍫 Depositaste ${cantidad} 🍪 al banco\n\nBilletera: ${user.coin} 🍪\nBanco: ${user.bank} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }

  // RETIRAR TODO
  if (command === 'rall') {
    user.bank = Number(user.bank) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 Usa ${usedPrefix}pagardeuda <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (user.bank === 0) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Banco vacío')
    let cantidad = user.bank
    user.bank = 0
    user.coin = (Number(user.coin) || 0) + cantidad
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 RETIRO ───\n\n🍫 Retiraste ${cantidad} 🍪\n\nBilletera: ${user.coin} 🍪\nBanco: ${user.bank} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }

  // DEPOSITAR MONTO
  if (command === 'd') {
    let monto = parseInt(text)
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 Usa ${usedPrefix}pagardeuda <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (isNaN(monto) || monto < 1) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Uso: ${usedPrefix}d <monto>`)
    if (user.coin < monto) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 No tienes suficiente. Billetera: ${user.coin} 🍪`)
    user.coin -= monto
    user.bank = (Number(user.bank) || 0) + monto
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 DEPÓSITO ───\n\n🍫 Depositaste ${monto} 🍪\n\nBilletera: ${user.coin} 🍪\nBanco: ${user.bank} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }

  // RETIRAR MONTO
  if (command === 'r') {
    let monto = parseInt(text)
    user.bank = Number(user.bank) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 Usa ${usedPrefix}pagardeuda <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (isNaN(monto) || monto < 1) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Uso: ${usedPrefix}r <monto>`)
    if (user.bank < monto) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Banco: ${user.bank} 🍪\n🍨 No alcanza`)
    user.bank -= monto
    user.coin = (Number(user.coin) || 0) + monto
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 RETIRO ───\n\n🍫 Retiraste ${monto} 🍪\n\nBilletera: ${user.coin} 🍪\nBanco: ${user.bank} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
  }

  // PAY
  if (['pay', 'pagar'].includes(command)) {
    let args = text.split(' ')
    if (args.length < 2) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Uso: ${usedPrefix + command} <monto> @user`)
    let monto = parseInt(args[0])
    user.coin = Number(user.coin) || 0
    user.deuda = Number(user.deuda) || 0
    if (user.deuda > 0) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Deuda de ${user.deuda} 🍪\n🍨 Usa ${usedPrefix}pagardeuda <monto>\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`)
    if (isNaN(monto) || monto < 1) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Monto inválido')
    if (user.coin < monto) return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍫 Saldo: ${user.coin} 🍪\n🍨 No alcanza`)
    let who = m.mentionedJid[0]
    if (!who) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 Menciona a quien le quieres transferir')
    who = who.replace(/@lid$/, '@s.whatsapp.net')
    if (who === m.sender) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 No te puedes pagar a ti misma')
    if (!global.db.data.users[who]) global.db.data.users[who] = { coin: 0, bank: 0, deuda: 0 }
    global.db.data.users[who].coin = Number(global.db.data.users[who].coin) || 0
    user.coin -= monto
    global.db.data.users[who].coin += monto
    return m.reply(`🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TRANSFERENCIA ───\n\n🍫 Le pagaste ${monto} 🍪 a @${who.split('@')[0]}\n\nTu saldo: ${user.coin} 🍪\n\n─── 💗 CONTACTO ───\nNúmero: +52 862 102 9907`, null, { mentions: [who, m.sender] })
  }

  // LEADERBOARD
  if (['leaderboard', 'lb', 'top'].includes(command)) {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({
      jid: key,
      coin: Number(value.coin) || 0,
      bank: Number(value.bank) || 0,
      deuda: Number(value.deuda) || 0
    })).filter(v => v.coin || v.bank)

    if (users.length === 0) return m.reply('🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n🍨 No hay usuarios con galletas')
    users.sort((a, b) => (b.coin + b.bank) - (a.coin + a.bank))
    let texto = `🍫 𝐂𝐮𝐩𝐢𝐝 𝐃𝐨𝐥𝐥𝐬 💗\n\n─── 🍪 TOP DOLLS ───\n\n`
    let len = Math.min(10, users.length)
    for (let i = 0; i < len; i++) {
      let user = users[i]
      let total = user.coin + user.bank
      let medalla = i === 0 ? '🍫' : i === 1 ? '🍨' : i === 2 ? '🍪' : `${i + 1}.`
      texto += `${medalla} @${user.jid.split('@')[0]}\n💗 Total: ${total} 🍪`
      if (user.deuda > 0) texto += ` | Deuda: ${user.deuda} 🍪`
      texto += `\n\n`
    }
    let posicion = users.findIndex(v => v.jid === m.sender) + 1
    if (posicion > 0) texto += `─── 💗 TU LUGAR ───\nTu posición: #${posicion}\nNúmero: +52 862 102 9907`
    return conn.reply(m.chat, texto, m, { mentions: users.slice(0, len).map(v => v.jid) })
  }
}

handler.help = ['saldo', 'dall', 'rall', 'd', 'r', 'pay', 'lb']
handler.tags = ['economy']
handler.command = ['saldo', 'bal', 'balance', 'dall', 'rall', 'd', 'r', 'pay', 'pagar', 'leaderboard', 'lb', 'top']
handler.group = true
export default handler
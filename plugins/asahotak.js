let fetch = require('node-fetch')

let timeout = 120000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.asahotak = conn.asahotak ? conn.asahotak : {}
    let id = m.chat
    if (id in conn.asahotak) {
        conn.reply(m.chat, 'ഈ ചാറ്റിൽ ഇപ്പോഴും ഉത്തരം ലഭിക്കാത്ത ചോദ്യങ്ങളുണ്ട്', conn.asahotak[id][0])
        throw false
    }
    let res = await fetch(global.API('xteam', '/game/asahotak', {}, 'APIKEY'))
    if (res.status !== 200) throw await res.text()
    let json = await res.json()
    if (!json.status) throw json
    let caption = `
${json.result.soal}

Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}ao untuk bantuan
Bonus: ${poin} XP
`.trim()
    conn.asahotak[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.asahotak[id]) conn.reply(m.chat, `സമയം കഴിഞ്ഞു!\nഉത്തരം *${json.result.jawaban}*`, conn.asahotak[id][0])
            delete conn.asahotak[id]
        }, timeout)
    ]
}
handler.help = ['asahotak']
handler.tags = ['game']
handler.command = /^asahotak/i

module.exports = handler

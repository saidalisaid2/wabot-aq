let { WAMessageProto } = require('@adiwajshing/baileys')
let handler = async (m, { command, usedPrefix, text }) => {
    let M = WAMessageProto.WebMessageInfo
    let which = command.replace(/add/i, '')
    if (!m.quoted) throw 'Reply Pesan!'
    if (!text) throw `Gunakan *${usedPrefix}list${which}* പട്ടിക കാണാൻ`
    let msgs = global.db.data.msgs
    if (text in msgs) throw `'${text}' telah terdaftar di list pesan`
    msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON()
    m.reply(`സന്ദേശ ലിസ്റ്റിൽ സന്ദേശം വിജയകരമായി ചേർത്തു '${text}'
    
ഉപയോഗിച്ച് ആക്സസ് ചെയ്യുക ${usedPrefix}get${which} ${text}`)
}
handler.help = ['vn', 'msg', 'video', 'audio', 'img', 'sticker'].map(v => 'add' + v + ' <text>')
handler.tags = ['database']
handler.command = /^add(vn|msg|video|audio|img|sticker)$/

module.exports = handler

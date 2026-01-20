const axios = require('axios');
module.exports = {
    cmd: "joke",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => { // config එකතු කළා
        try {
            const res = await axios.get('https://official-joke-api.appspot.com/random_joke');
            await sock.sendMessage(from, { text: `😂 ${res.data.setup}\n\n*${res.data.punchline}*` }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ API Error." });
        }
    }
};

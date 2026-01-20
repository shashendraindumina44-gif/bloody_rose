const axios = require('axios');

module.exports = {
    cmd: ["weather", "කාලගුණය", "sky"],
    execution: async (sock, m, from, args) => {
        try {
            const cityName = args.join(" ");
            if (!cityName) return sock.sendMessage(from, { text: "Lord Indumina 🗣️, නගරයක නම ඇතුළත් කරන්න. (Ex: .weather Colombo)" }, { quoted: m });

            // API Key අවශ්‍ය නැති ලස්සනම සර්විස් එක
            // ?format=4 කියන එකෙන් ලස්සන එක පේළියක විස්තරයක් එනවා
            const response = await axios.get(`https://wttr.in/${cityName}?format=%c+Temp:+%t+%w+%h`);
            const data = response.data;

            // සිරාම Animation එක වගේ පේන Text Art එක මෙතනින් ගන්නවා
            const asciiArt = await axios.get(`https://wttr.in/${cityName}?0&Q&T`);
            const art = asciiArt.data;

            const weatherMsg = `
☁️ *BLOODY ROSE WEATHER* 🌹🩸
--------------------------------------------------
📍 *නගරය:* ${cityName.toUpperCase()}
📊 *තත්ත්වය:* ${data}

🔮 *සෙනුරිගේ අනාවැකිය:* අද දවස Lord Indumina ගේ අණ පරිදි ඉතා සුන්දර වනු ඇත! 🗣️
--------------------------------------------------
\`\`\`${art}\`\`\`
--------------------------------------------------
`;

            await sock.sendMessage(from, { react: { text: '☁️', key: m.key } });
            
            // ලස්සනට පේන්න Typing Effect එකක් දාමු
            await sock.sendPresenceUpdate('composing', from);
            
            setTimeout(async () => {
                await sock.sendMessage(from, { text: weatherMsg }, { quoted: m });
            }, 2000);

        } catch (e) {
            console.log("Weather Error:", e);
            await sock.sendMessage(from, { text: "ස්වාමීනි Lord Indumina, නම වැරදියි වගේ. නැවත උත්සාහ කරන්න. 🗣️" }, { quoted: m });
        }
    }
};
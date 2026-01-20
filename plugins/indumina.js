const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    cmd: ["indumina"],
    execution: async (sock, m, from, args) => {
        try {
            // මුලින්ම යවන මැසේජ් එක
            let { key } = await sock.sendMessage(from, { text: "🚀 Loading..." });

            // එකින් එක Edit වන වචන පෙළ
            const steps = [
                { t: "🌹 G", r: "❤️" },
                { t: "🌹 GO", r: "🧡" },
                { t: "🌹 GOD", r: "💛" },
                { t: "🌹 GOD I", r: "💚" },
                { t: "🌹 GOD IN", r: "💙" },
                { t: "🌹 GOD INDU", r: "💜" },
                { t: "🌹 GOD INDUMINA", r: "✨" },
                { t: "👑 INDUMINA IS HERE 👑", r: "🔥" }
            ];

            // Loop එක හරහා මැසේජ් එක Edit කිරීම සහ Reaction මාරු කිරීම
            for (let step of steps) {
                await delay(1500); // තත්පර 1.5 ක පරතරයක් (WhatsApp සර්වර් එකට බරක් නොවන්න)
                
                // මැසේජ් එක Edit කිරීම
                await sock.sendMessage(from, { 
                    text: step.t, 
                    edit: key 
                });

                // Reaction එක මාරු කිරීම
                await sock.sendMessage(from, { 
                    react: { text: step.r, key: m.key } 
                });
            }

        } catch (e) {
            console.log(e);
        }
    }
};
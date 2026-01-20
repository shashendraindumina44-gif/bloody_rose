const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    cmd: ["scan"],
    execution: async (sock, m, from, args) => {
        try {
            let { key } = await sock.sendMessage(from, { text: "🔍 පද්ධතිය පරික්ෂා කරමින්..." });
            const steps = [
                "📡 දත්ත ලබා ගනිමින්...",
                "🧠 මොළය පරික්ෂා කරමින්...",
                "⚠️ අවධානයට: මොළයක් හමු නොවුණි!",
                "📊 ප්‍රතිඵලය: 100% පිස්සෙක් 🤣"
            ];
            for (let step of steps) {
                await delay(1500);
                await sock.sendMessage(from, { text: step, edit: key });
            }
        } catch (e) { console.log(e); }
    }
};
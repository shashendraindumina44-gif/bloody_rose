module.exports = {
    cmd: ["ping", "speed"],
    execution: async (sock, m, from, args) => {
        try {
            // 1. Reaction එකක් දාමු
            await sock.sendMessage(from, { react: { text: '⚡', key: m.key } });

            // 2. Loading පණිවිඩය යවා එය Edit කරමු
            const { key } = await sock.sendMessage(from, { text: '🚀 Loading...' });

            // Animation Frames
            const frames = [
                '🚀 L o a d i n g .',
                '🚀 L o a d i n g . .',
                '🚀 L o a d i n g . . .',
                '🚀 B L O O D Y  R O S E 🌹'
            ];

            for (let frame of frames) {
                await new Promise(resolve => setTimeout(resolve, 300)); // වේගය පාලනයට
                await sock.sendMessage(from, { text: frame, edit: key });
            }

            // 3. අවසාන Ping එක ගණනය කරමු
            const start = Date.now();
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const end = Date.now();
            const ping = end - start;

            const finalMsg = `✨ *B L O O D Y  R O S E  P I N G* ✨

⚡ *LATENCY:* ${ping}ms
🕒 *UPTIME:* ${hours}h ${minutes}m
🛰️ *SERVER:* Localhost (PC)

> Created by Indumina 🗣️`;

            // පණිවිඩය අවසන් වරට Edit කරමු
            await sock.sendMessage(from, { text: finalMsg, edit: key });

        } catch (e) {
            console.log("Loading Ping Error: ", e);
        }
    }
};
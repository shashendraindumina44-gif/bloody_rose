module.exports = {
    cmd: ["menu", "help", "list"],
    execution: async (sock, m, from, args) => {
        try {
            // 1. Loading Animation
            const { key } = await sock.sendMessage(from, { text: "🌹 *B L O O D Y  R O S E  L O A D I N G...*" });
            
            await new Promise(resolve => setTimeout(resolve, 300));
            await sock.sendMessage(from, { text: "🌹▒▒▒▒▒▒▒▒▒▒ 10%", edit: key });
            await new Promise(resolve => setTimeout(resolve, 300));
            await sock.sendMessage(from, { text: "🌹████▒▒▒▒▒▒ 40%", edit: key });
            await new Promise(resolve => setTimeout(resolve, 300));
            await sock.sendMessage(from, { text: "🌹███████▒▒▒ 70%", edit: key });
            await new Promise(resolve => setTimeout(resolve, 300));
            await sock.sendMessage(from, { text: "🌹██████████ 100%", edit: key });

            // 2. User Info & DP
            const sender = m.sender || m.key.participant || from;
            let ppUrl;
            try {
                ppUrl = await sock.profilePictureUrl(sender, 'image');
            } catch {
                ppUrl = 'https://i.ibb.co/3S8C6v5/logo.jpg'; 
            }

            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();

            // 3. දිග මෙනු එක මෙතන සිට...
            let menuText = `✨ *B L O O D Y  R O S E  U L T I M A T E* ✨

👋 *Hello:* @${sender.split('@')[0]}
📅 *Date:* ${date}
⏰ *Time:* ${time}
🚀 *Uptime:* ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m
📊 *Version:* 1.5.0 (Pro)

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

⚡ *「 SYSTEM & STATUS 」*
• .ping - Speed test
• .alive - Bot status
• .runtime - Online time
• .restart - Reboot bot
• .info - System info

🛡️ *「 ADMIN COMMANDS 」*
• .kick - Remove member
• .add - Add member
• .promote - Make admin
• .demote - Remove admin
• .mute - Close chat
• .unmute - Open chat
• .tagall - Mention all
• .hidetag - Secret tag
• .warn - Warn member
• .group - Group settings

🎬 *「 DOWNLOAD CENTER 」*
• .song - YT Audio
• .video - YT Video
• .tiktok - No watermark
• .fb - Facebook video
• .ig - Instagram downloader
• .git - Github clone
• .yt - YT search
• .lyrics - Song lyrics

🤖 *「 AI & SEARCH 」*
• .ai - ChatGPT 4
• .gemini - Google AI
• .dalle - Image creator
• .google - Web search
• .wiki - Wikipedia
• .weather - City weather
• .trt - Translator

🎭 *「 FUN & GAMES 」*
• .slap - Slap someone
• .horo - Daily horo
• .truth - Truth or lie
• .joke - Funny stories
• .wadan - Sinhala wadan
• .hack - Prank hack
• .fact - Random facts

🛠️ *「 TOOLS & CONVERTER 」*
• .sticker - Image to sticker
• .toimage - Sticker to image
• .fancy - Cool text fonts
• .tourl - File to link
• .ss - Site screenshot
• .shorten - Link shortener
• .qr - Create QR code

🎨 *「 LOGO MAKER 」*
• .neon - Neon logo
• .blackpink - BP logo
• .graffiti - Cool logo
• .glitch - Glitch text

💰 *「 ECONOMY SYSTEM 」*
• .daily - Daily reward
• .balance - Check wallet
• .gamble - Bet money
• .rob - Rob a user

👑 *「 OWNER ONLY 」*
• .owner - Contact owner
• .bc - Broadcast message
• .setpp - Change bot DP
• .block - Block user

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
> 🌹 *BLOODY ROSE MD - POWERED BY AI*
> *Developed by Loard Indumina* 🗣️`;

            // 4. Loading එක අයින් කරලා මෙනු එක යවමු
            await sock.sendMessage(from, { delete: key });

            await sock.sendMessage(from, { 
                text: menuText,
                mentions: [sender],
                contextInfo: {
                    externalAdReply: {
                        title: "B L O O D Y  R O S E  M D",
                        body: "Ultimate Multi-Device Bot",
                        mediaType: 1,
                        thumbnailUrl: ppUrl,
                        showAdAttribution: true,
                        sourceUrl: "https://wa.me/94768867146"
                    }
                }
            }, { quoted: m });

        } catch (e) {
            console.log("Menu Error: ", e);
        }
    }
};
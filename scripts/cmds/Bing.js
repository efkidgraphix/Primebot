const axios = require('axios');

module.exports = {
  config: {
    name: "bing",
    version: "1.1",
    author: "OtinXSandip | ArYAN", // command re - modify + created by ArYAN
    countDown: 10,
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    longDescription: {
      en: "Generate images from text prompts using the Bing image generation API."
    },
    category: "image",
    guide: {
      en: '{pn} your prompt'
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("❓| Please provide a prompt.");
    }

    let prompt = text;

    message.reply("✅| Creating your Imagination...", async (err, info) => {
      let ui = info.messageID;
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      try {
        const response = await axios.get(`https://xxxxxxxx-mvam.onrender.com/q?prompt=${encodeURIComponent(prompt)}`);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        const images = response.data;
        message.unsend(ui);
        message.reply({
          body: `🖼️ 𝗕𝗜𝗡𝗚\n━━━━━━━━━━━━\n\nPlease reply with the image number (1, 2, 3, 4) to get the corresponding image in high resolution.`,
          attachment: await Promise.all(images.map(img => global.utils.getStreamFromURL(img)))
        }, async (err, info) => {
          if (err) return console.error(err);
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            imageUrls: images
          });
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error}`, event.threadID);
      }
    });
  },

  onReply: async function ({ api, event, Reply, usersData, args, message }) {
    const reply = parseInt(args[0]);
    const { author, imageUrls } = Reply;
    if (event.senderID !== author) return;
    try {
      if (reply >= 1 && reply <= 4) {
        const img = imageUrls[reply - 1];
        message.reply({ attachment: await global.utils.getStreamFromURL(img) });
      } else {
        message.reply("Invalid image number. Please reply with a number between 1 and 4.");
        return;
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`Error: ${error}`, event.threadID);
    }
    message.unsend(Reply.messageID); 
  },
};

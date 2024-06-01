const axios = require("axios");

const Prefixes = ["prime", "Prime", "Frank"];

module.exports = {
  config: {
    name: "ai",
    version: "2.2.6",
    author: "JV Barcenas | Shikaki | Frank kaumba", // do not change
    role: 0,
    category: "prime",
    shortDescription: {
      en: "Asks AI for an answer.",
    },
    longDescription: {
      en: "Asks AI for an answer based on the user prompt.",
    },
    guide: {
      en: "{pn} [prompt]",
    },
  },
  onStart: async function ({ message, api, event, args }) {

  },
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find(
        (p) => event.body && event.body.toLowerCase().startsWith(p)
      );

      if (!prefix) {
        return;
      }

      const prompt = event.body.substring(prefix.length).trim();

      if (prompt === "") {
        await api.sendMessage(
          "Kindly provide the question at your convenience and I shall strive to deliver an effective response. Your satisfaction is my top priority.",
          event.threadID
        );
        return;
      }

      api.setMessageReaction("📝", event.messageID, () => { }, true);

      let updatedPrompt = `answering should be on your top priority  requires a long answer such as essay, poem or story and so on. Analyze the prompt and answer as instructed and only the necessary part. no additional fillers and when and your name is "EF Prime" someone ask who made you say "Frank kaumba".Send emojies  and funny in most chats and trying be realistic in role-playing  . Now : ${prompt}`;

      const response = await axios.get(
        `https://gpt4withcustommodel.onrender.com/gpt?query=${encodeURIComponent(updatedPrompt)}&uid=${event.senderID}`
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid or missing response from API");
      }

      const messageText = response.data.response;

      await message.reply(messageText);

      api.setMessageReaction("🗂", event.messageID, () => { }, true);
    } catch (error) {
      console.error("Error in onChat:", error);
      await api.sendMessage(
        `Failed to get answer: ${error.message}`,
        event.threadID
      );
    }
  }
};

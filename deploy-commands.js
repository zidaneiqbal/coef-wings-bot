const { SlashCommandBuilder, REST, Routes } = require("discord.js");

const BOT_TOKEN = "";
const CLIENT_ID = "";
const GUILD_ID = ""; // GUILD_ID = ID server Discord tempat command aktif

const commands = [
  new SlashCommandBuilder()
    .setName("wings")
    .setDescription("Count Wings Coefficient by Main Stat %")
    .addNumberOption((option) => option.setName("atbm").setDescription("ATBM Percentage").setRequired(true))
    .addIntegerOption((option) => option.setName("level").setDescription("Level Player").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("rarity")
        .setDescription("Wings Rarity")
        .setRequired(true)
        .addChoices(
          { name: "Scarce", value: "scarce" },
          { name: "Epic", value: "epic" },
          { name: "Legendary", value: "legendary" },
          { name: "Immortal", value: "immortal" },
          { name: "Myth", value: "myth" },
          { name: "Eternal", value: "eternal" },
          { name: "Celestial", value: "celestial" }
        )
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("coef")
    .setDescription("Count Main Stats % by Wings Coefficient")
    .addNumberOption((option) => option.setName("wingcoef").setDescription("Wings Coefficient").setRequired(true))
    .addIntegerOption((option) => option.setName("level").setDescription("Level Player").setRequired(true))
    .addStringOption((option) =>
      option
        .setName("rarity")
        .setDescription("Wings Rarity")
        .setRequired(true)
        .addChoices(
          { name: "Scarce", value: "scarce" },
          { name: "Epic", value: "epic" },
          { name: "Legendary", value: "legendary" },
          { name: "Immortal", value: "immortal" },
          { name: "Myth", value: "myth" },
          { name: "Eternal", value: "eternal" },
          { name: "Celestial", value: "celestial" }
        )
    )
    .toJSON(),

  new SlashCommandBuilder().setName("max-coef").setDescription("Known Max Wings Coefficient").toJSON(),
];

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log("⏳ Deploying global slash commands...");
    await rest.put(
      Routes.applicationCommands(CLIENT_ID), // ⬅️ global, tanpa Guild ID
      { body: commands }
    );
    console.log("✅ Slash commands registered globally!");
  } catch (error) {
    console.error(error);
  }
})();

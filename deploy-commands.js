const { SlashCommandBuilder, REST, Routes } = require("discord.js");

// Masukkan token & ID langsung di sini
const BOT_TOKEN = "MTM4MDAzODYxNzA0NDM1MzEyNQ.GOFKXr.tJq-WE7qeGqMMtuNJ4OHV7wvVPsw6gDolV1SUQ";
const CLIENT_ID = "1380038617044353125";
const GUILD_ID = "1017701430011899915"; // GUILD_ID = ID server Discord tempat command aktif

const commands = [
  new SlashCommandBuilder()
    .setName("wings")
    .setDescription("Hitung Wings Coefficient")
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
];

const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log("⏳ Registering slash commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Slash commands registered!");
  } catch (error) {
    console.error(error);
  }
})();

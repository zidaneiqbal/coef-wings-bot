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

  // new SlashCommandBuilder()
  //   .setName("world-drop")
  //   .setDescription("Calculate World Drop per hour")
  //   .addStringOption((option) => option.setName("world_no").setDescription("World Number").setRequired(true))
  //   .addIntegerOption((option) => option.setName("clear_time").setDescription("Clear Time (seconds)").setRequired(true))
  //   .addNumberOption((option) => option.setName("xp_boost").setDescription("XP Boost Multiplier").setRequired(false))
  //   .addNumberOption((option) => option.setName("gold_boost").setDescription("Gold Boost Multiplier").setRequired(false))
  //   .addNumberOption((option) => option.setName("ore_boost").setDescription("Ore Boost Multiplier").setRequired(false))
  //   .toJSON(),

  // new SlashCommandBuilder()
  //   .setName("exp-to-level-up")
  //   .setDescription("Calculate Exp Needed to Level Up")
  //   .addIntegerOption((option) => option.setName("current_level").setDescription("Current Level").setRequired(true))
  //   .addIntegerOption((option) => option.setName("target_level").setDescription("Target Level").setRequired(false))
  //   .toJSON(),

  new SlashCommandBuilder()
    .setName("hours-to-level-up")
    .setDescription("Calculate Hours Needed to Level Up")
    .addIntegerOption((option) => option.setName("current_level").setDescription("Current Level").setRequired(true))
    .addIntegerOption((option) => option.setName("target_level").setDescription("Target Level").setRequired(true))
    .addStringOption((option) => option.setName("world_no").setDescription("World Number").setRequired(true))
    .addIntegerOption((option) => option.setName("clear_time").setDescription("Clear Time (seconds) *without delay or time you exit from world*").setRequired(true))
    .addNumberOption((option) => option.setName("xp_boost").setDescription("XP Boost Multiplier in % (don't put % on it)").setRequired(false))
    .addNumberOption((option) => option.setName("gold_boost").setDescription("Gold Boost Multiplier in % (don't put % on it)").setRequired(false))
    .addNumberOption((option) => option.setName("ore_boost").setDescription("Ore Boost Multiplier in % (don't put % on it)").setRequired(false))
    .toJSON(),

  new SlashCommandBuilder().setName("help").setDescription("Show Help Information").toJSON(),
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

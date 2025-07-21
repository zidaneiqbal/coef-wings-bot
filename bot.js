const { Client, GatewayIntentBits, Events, EmbedBuilder } = require("discord.js");

const BOT_TOKEN = "";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rarityMap = {
  scarce: 6,
  epic: 7,
  legendary: 8,
  immortal: 9,
  myth: 10,
  eternal: 11,
  celestial: 12,
};

function calculateWingsCoefficient(atbm, level, rarityValue) {
  const denominator = (0.05 + (level - 1) * 0.0000555555555555556) * (1 + (rarityValue - 5) * 0.1) * 6.25 * ((rarityValue - 5) / 7);
  return Math.round((atbm / denominator / 100) * 1000) / 1000;
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    const commandName = interaction.commandName;

    if (commandName === "wings") {
      const atbm = interaction.options.getNumber("atbm");
      const level = interaction.options.getInteger("level");
      const rarity = interaction.options.getString("rarity");

      const rarityValue = rarityMap[rarity];
      const result = calculateWingsCoefficient(atbm, level, rarityValue);

      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .addFields(
          { name: "Main Stat %", value: `${atbm}%`, inline: true },
          { name: "Level", value: `${level}`, inline: true },
          { name: "✨ Rarity", value: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`, inline: true },
          { name: "🧮 Coefficient", value: `**${result}**` }
        )
        .setFooter({ text: "---", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (commandName === "coef") {
      const wingCoef = interaction.options.getNumber("wingcoef");
      const level = interaction.options.getInteger("level");
      const rarity = interaction.options.getString("rarity");

      const rarityValue = rarityMap[rarity];

      const atbm = wingCoef * (0.05 + (level - 1) * 0.0000555555555555556) * (1 + (rarityValue - 5) * 0.1) * 6.25 * ((rarityValue - 5) / 7) * 100;

      const rounded = Math.round(atbm * 1000) / 1000;

      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .addFields(
          { name: "Coefficient", value: `${wingCoef}`, inline: true },
          { name: "Level", value: `${level}`, inline: true },
          { name: "✨ Rarity", value: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`, inline: true },
          { name: "🧮 Main Stat %", value: `${rounded}%` }
        )
        .setFooter({ text: "---", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (commandName === "max-coef") {
      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .setTitle("Known Max Wings Coefficient")
        .setDescription("**ATBM = 1.5** \n **HPBM = 1.5** \n **DTM = 1.2** \n **DTP = 1.05**")
        .setFooter({ text: "---", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  } catch (error) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "Terjadi error saat memproses command.", ephemeral: true });
    } else {
      await interaction.reply({ content: "Terjadi error saat memproses command.", ephemeral: true });
    }
  }
});

client.login(BOT_TOKEN);

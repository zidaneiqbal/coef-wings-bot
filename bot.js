const { Client, GatewayIntentBits, Events } = require("discord.js");

const BOT_TOKEN = "MTM4MDAzODYxNzA0NDM1MzEyNQ.GOFKXr.tJq-WE7qeGqMMtuNJ4OHV7wvVPsw6gDolV1SUQ"; // Masukkan langsung token bot kamu

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

function calculateWingsCoefficient(atbmPercentage, levelPlayer, rarityValue) {
  const denominator = (0.05 + (levelPlayer - 1) * 0.0000555555555555556) * (1 + (rarityValue - 5) * 0.1) * 6.25 * ((rarityValue - 5) / 7);
  const coefficient = Math.round((atbmPercentage / denominator / 100) * 1000) / 1000;
  return coefficient;
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot ready as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "wings") {
    const atbm = interaction.options.getNumber("atbm");
    const level = interaction.options.getInteger("level");
    const rarity = interaction.options.getString("rarity");

    const rarityValue = rarityMap[rarity];
    const result = calculateWingsCoefficient(atbm, level, rarityValue);

    await interaction.reply(`ATBM ${atbm}%, Level ${level}, dan Rarity '${rarity.charAt(0).toUpperCase() + rarity.slice(1)}' \nWings Coefficient = **${result}**`);
  }
});

client.login(BOT_TOKEN);

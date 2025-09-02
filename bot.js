const { Client, GatewayIntentBits, Events, EmbedBuilder } = require("discord.js");
const worldCalculator = require("./world-calculator.js");
const levelList = require("./level-list.js");

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

function worldDropCalculator(worldNo, clear_time, xp_boost, gold_boost, ore_boost) {
  const world = worldCalculator.find((w) => w.world_no === worldNo);
  if (!world) {
    throw new Error("World not found");
  }
  // xp boost, gold boost, ore boost default 100%
  // input: world_no, clear_time (seconds), xp_boost (1.0 = 100%), gold_boost (1.0 = 100%), ore_boost (1.0 = 100%)
  // output: total_xp, total_gold, total_ore per hour
  // example: /world-drop world_no:81 clear_time:300 xp_boost:1.5 gold_boost:1.2 ore_boost:1.0
  // result: World 81 - World 1 Master (Master) \n Clear Time: 300 seconds \n Total Clears per Hour: 12 \n Total XP per Hour: 900000 \n Total Gold per Hour: 2188800 \n Total Ore per Hour: 192
  const clears_per_hour = 3600 / (clear_time + 5);
  const total_xp = Math.floor(world.xp_per_clear * clears_per_hour * xp_boost);
  const total_gold = Math.floor(world.gold_per_clear * clears_per_hour * gold_boost);
  const total_ore = Math.floor(world.ore_per_clear * clears_per_hour * ore_boost);
  return {
    clears_per_hour,
    total_xp,
    total_gold,
    total_ore,
  };
}

// Calculate How Much Exp to Target Level Up
function calculateExpToLevelUp(currentLevel, targetLevel) {
  if (currentLevel < 1 || currentLevel >= levelList.length) {
    throw new Error("Current level out of range");
  }
  if (targetLevel < 1 || targetLevel >= levelList.length) {
    throw new Error("Target level out of range");
  }

  // Current level exp ditambah sampai target level
  // Jika Current Level = 5 dan target level = 6, maka hanya perlu ambil data exp level 5
  let totalExp = 0;
  for (let lvl = currentLevel - 1; lvl < targetLevel - 1; lvl++) {
    totalExp += levelList[lvl].exp;
  }
  return totalExp;
}

// Calculate How Much Hours to Level Up
function calculateHoursToLevelUp(currentLevel, targetLevel, world, clear_time, xp_boost = 1) {
  if (currentLevel < 1 || currentLevel >= levelList.length) {
    throw new Error("Current level out of range");
  }
  if (targetLevel < 1 || targetLevel >= levelList.length) {
    throw new Error("Target level out of range");
  }
  const totalExp = calculateExpToLevelUp(currentLevel, targetLevel);

  const clears_per_hour = 3600 / clear_time;
  const expPerHour = Math.floor(world.xp_per_clear * clears_per_hour * xp_boost);
  return totalExp / expPerHour;
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
        .setDescription("**ATBM = 1.5** \n **HPBM = 1.5** \n **DTM = 1.2** \n **DTP = 1.05** \n **Move Speed = 0.9** \n **PDR = 0.45-0.5 (unsure) 😔**")
        .setFooter({ text: "---", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (commandName === "world-drop") {
      const worldNo = interaction.options.getString("world_no");
      const clear_time = interaction.options.getInteger("clear_time");
      const xp_boost = interaction.options.getNumber("xp_boost") / 100 || 1;
      const gold_boost = interaction.options.getNumber("gold_boost") / 100 || 1;
      const ore_boost = interaction.options.getNumber("ore_boost") / 100 || 1;
      const result = worldDropCalculator(worldNo, clear_time, xp_boost, gold_boost, ore_boost);
      const world = worldCalculator.find((w) => w.world_no === worldNo);
      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .setTitle(`World ${world.world_no} - ${world.world_name} (${world.world_difficulty})`)
        .addFields(
          { name: "Clear Time", value: `${clear_time} Seconds`, inline: true },
          { name: "Total Clears per Hour", value: `**${result.clears_per_hour.toFixed(1)}**`, inline: true },
          { name: "\u200B", value: "\u200B" },
          { name: "XP Boost", value: `x${(xp_boost * 100).toFixed(0)}%`, inline: true },
          { name: "Gold Boost", value: `x${(gold_boost * 100).toFixed(0)}%`, inline: true },
          { name: "Ore Boost", value: `x${(ore_boost * 100).toFixed(0)}%`, inline: true },
          { name: "\u200B", value: "\u200B" },
          { name: "Total XP", value: `**${result.total_xp.toLocaleString()}**`, inline: true },
          { name: "Total Gold", value: `**${result.total_gold.toLocaleString()}**`, inline: true },
          { name: "Total Ore", value: `**${result.total_ore.toLocaleString()}**`, inline: true }
        )
        .setFooter({ text: "---", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else if (commandName === "exp-to-level-up") {
      const currentLevel = interaction.options.getInteger("current_level");
      let targetLevel = interaction.options.getInteger("target_level") || currentLevel + 1;
      if (targetLevel > levelList.length - 1) {
        targetLevel = levelList.length - 1;
      }
      const expNeeded = calculateExpToLevelUp(currentLevel, targetLevel);
      await interaction.reply({ content: `Exp needed to level up from ${currentLevel} to ${targetLevel} is ${expNeeded.toLocaleString()}.`, ephemeral: true });
    } else if (commandName === "hours-to-level-up") {
      const worldNo = interaction.options.getString("world_no");
      const currentLevel = interaction.options.getInteger("current_level");
      const targetLevel = interaction.options.getInteger("target_level");
      const clear_time = interaction.options.getInteger("clear_time");
      const xp_boost = interaction.options.getNumber("xp_boost") / 100 || 1;
      const gold_boost = interaction.options.getNumber("gold_boost") / 100 || 1;
      const ore_boost = interaction.options.getNumber("ore_boost") / 100 || 1;

      const world = worldCalculator.find((w) => w.world_no === worldNo);
      if (!world) {
        await interaction.reply({ content: "World not found. Please use a valid world number.", ephemeral: true });
        return;
      }

      const resultWorld = worldDropCalculator(worldNo, clear_time, xp_boost, gold_boost, ore_boost);
      const hoursNeeded = calculateHoursToLevelUp(currentLevel, targetLevel, world, clear_time, xp_boost);

      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .setTitle(`World ${world.world_no} - ${world.world_name} (${world.world_difficulty})`)
        .addFields(
          { name: "Clear Time", value: `${clear_time} Seconds`, inline: true },
          { name: "Total Clears per Hour", value: `**${resultWorld.clears_per_hour.toFixed(1)}**`, inline: true },
          { name: "Hours to Level Up", value: `**${hoursNeeded.toFixed(2)} Hours**`, inline: true },
          { name: "\u200B", value: "\u200B" },
          { name: "XP Boost", value: `x${(xp_boost * 100).toFixed(0)}%`, inline: true },
          { name: "Gold Boost", value: `x${(gold_boost * 100).toFixed(0)}%`, inline: true },
          { name: "Ore Boost", value: `x${(ore_boost * 100).toFixed(0)}%`, inline: true },
          { name: "\u200B", value: "\u200B" },
          { name: "Total XP", value: `**${resultWorld.total_xp.toLocaleString()}**`, inline: true },
          { name: "Total Gold", value: `**${resultWorld.total_gold.toLocaleString()}**`, inline: true },
          { name: "Total Ore", value: `**${resultWorld.total_ore.toLocaleString()}**`, inline: true }
        )
        .setFooter({ text: "---", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else if (commandName === "help") {
      const embed = new EmbedBuilder()
        .setColor(0x00bfff)
        .setTitle("Commands List")
        .setDescription("/wings-demo, /coef-demo, /max-coef, /hours-to-level-up")
        .setFooter({ text: "---", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({ content: "Command tidak dikenali.", ephemeral: true });
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

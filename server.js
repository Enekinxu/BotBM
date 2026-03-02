const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Muestra información del servidor Minecraft"),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🌐 Información del Servidor")
            .setColor("#8A2BE2")
            .setThumbnail("https://i.imgur.com/5c3QXQF.png")
            .setDescription("Aquí tienes los datos oficiales del servidor BloqueMágico | Network:")
            .addFields(
                {
                    name: "🟩 Minecraft Java",
                    value: "**IP:** play.bloquemagico.fun",
                    inline: false
                },
                {
                    name: "🟦 Minecraft Bedrock",
                    value: "**IP:** mc.bloquemagico.fun\n**Puerto:** 19132",
                    inline: false
                },
                {
                    name: "🛒 Tienda",
                    value: "https://tienda.bloquemagico.fun/",
                    inline: false
                },
                {
                    name: "📅 Fecha de creación",
                    value: "6/1/2026",
                    inline: true
                },
                {
                    name: "👥 Usuarios",
                    value: "130",
                    inline: true
                },
                {
                    name: "📺 Canales",
                    value: "108",
                    inline: true
                },
                {
                    name: "😃 Emojis",
                    value: "😀 😎 🤖 🧙‍♂️ ✨ 🔮 🐉",
                    inline: false
                }
            )
            .setFooter({ text: "BloqueMágico | Network" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
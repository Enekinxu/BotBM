const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("anuncios")
        .setDescription("Envía un anuncio en el canal actual")
        .addStringOption(opt =>
            opt.setName("mensaje")
                .setDescription("Contenido del anuncio")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const mensaje = interaction.options.getString("mensaje");
        const canal = interaction.channel;

        const embed = new EmbedBuilder()
            .setTitle("📢 Anuncio Oficial")
            .setDescription(mensaje)
            .addFields(
                {
                    name: "📍 Canal publicado",
                    value: `${canal}`,
                    inline: false
                }
            )
            .setColor("#00AEEF")
            .setTimestamp();

        // Respuesta privada al admin
        await interaction.reply({
            content: "Anuncio enviado correctamente.",
            ephemeral: true
        });

        // Enviar anuncio al canal
        await canal.send({
            embeds: [embed]
        });
    }
};
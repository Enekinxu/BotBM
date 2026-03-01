const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reglas")
        .setDescription("Muestra las reglas del servidor")
        .addStringOption(option =>
            option
                .setName("tipo")
                .setDescription("Elige qué reglas quieres ver")
                .setRequired(true)
                .addChoices(
                    { name: "Discord", value: "discord" },
                    { name: "Minecraft", value: "minecraft" }
                )
        ),

    async execute(interaction) {
        const tipo = interaction.options.getString("tipo");

        if (tipo === "discord") {
            const embedDiscord = new EmbedBuilder()
                .setTitle("📘 Reglas Discord")
                .setColor("#5865F2")
                .setDescription(
`🛡️ **Reglas Generales de Comportamiento**
• Respeta a todos los miembros. No se tolera el acoso, insultos ni discriminación.
• Evita contenido NSFW o sensible.
• No hagas spam ni flood.
• Usa lenguaje adecuado.
• Si hay un problema, contacta al staff.

🧙 **Reglas de Canales de Texto**
• Escribe en el canal correcto.
• Evita usar mayúsculas excesivas.
• Mantén el tema del canal.
• No promociones otros servidores sin permiso.
• No compartas información personal.

🎙️ **Reglas de Canales de Voz**
• Respeta los turnos de palabra.
• No pongas música sin permiso.
• Evita ruidos molestos o micrófono abierto constante.
• No grabes sin permiso.
• Usa nombres adecuados.

👑 **Reglas de Roles y Jerarquía**
• Respeta al staff y sus decisiones.
• No pidas roles especiales sin motivo.
• Los roles se ganan por participación o eventos.
• No abuses de tu rol.

🎉 **Reglas de Eventos y Actividades**
• Sigue las instrucciones del organizador.
• No hagas spoilers si están prohibidos.
• Participa con buena actitud.
• No interrumpas actividades.

🧵 **Reglas de Personalización y Creatividad**
• No robes contenido de otros usuarios.
• Comparte tus creaciones en los canales adecuados.
• Respeta derechos de autor.
• Sé constructivo al dar feedback.

🔵 **Reglas de Seguridad y Protección**
• No compartas enlaces sospechosos.
• Reporta comportamientos extraños al staff.
• No uses multicuentas para evadir sanciones.
• No intentes hackear, raidear o sabotear el servidor.`
                );

            return interaction.reply({ embeds: [embedDiscord] });
        }

        if (tipo === "minecraft") {
            const embedMinecraft = new EmbedBuilder()
                .setTitle("📘 Reglas de Minecraft")
                .setColor("#9E00FF")
                .setDescription(
`🛡️ **Reglas Generales del Reino**
• Respeta a todos los jugadores.
• No hagas spam ni flood.
• No uses lenguaje ofensivo.
• No compartas información personal.
• Sigue las instrucciones del staff.

🧱 **Construcción**
• No destruyas construcciones ajenas.
• Evita construcciones ofensivas.
• Respeta zonas protegidas.
• No abuses de redstone que cause lag.

⚔️ **PvP**
• Solo permitido en zonas habilitadas.
• No hagas spawnkill.
• Respeta duelos y eventos.
• No robes objetos sin reglas claras.

💰 **Economía**
• No estafes.
• Respeta precios oficiales.
• No dupliques objetos.
• Usa canales adecuados para intercambios.

🚫 **Técnico**
• Prohibido hacks o mods no autorizados.
• No explotes bugs.
• No hagas publicidad de otros servidores.
• Reporta comportamientos sospechosos.`
                );

            return interaction.reply({ embeds: [embedMinecraft] });
        }
    }
};
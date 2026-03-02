client.on("interactionCreate", async interaction => {
    if (interaction.isChatInputCommand()) {

        // ----------------------
        // COMANDO /REGLAS
        // ----------------------
        if (interaction.commandName === "reglas") {
            const tipo = interaction.options.getString("tipo");

            if (tipo === "discord") {
                const embedDiscord = new EmbedBuilder()
                    .setTitle("📘 Reglas Discord")
                    .setColor("#5865F2")
                    .setDescription(`🛡️ **Reglas Generales de Comportamiento**
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
• No intentes hackear, raidear o sabotear el servidor.`);
                return interaction.reply({ embeds: [embedDiscord] });
            }

            if (tipo === "minecraft") {
                const embedMinecraft = new EmbedBuilder()
                    .setTitle("📘 Reglas de Minecraft")
                    .setColor("#9E00FF")
                    .setDescription(`🛡️ **Reglas Generales del Reino**
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
• Reporta comportamientos sospechosos.`);
                return interaction.reply({ embeds: [embedMinecraft] });
            }
        }

        // ----------------------
        // COMANDO /SORTEO
        // ----------------------
        if (interaction.commandName === "sorteo") {
            const rango = interaction.options.getString("rango");

            const nombres = {
                mago: "🧙‍♂️ Rango Mago",
                manacrest: "🧙‍♂️ Rango Manacrest",
                arcano: "🧙‍♂️ Rango Arcano",
                hechicero: "🧙‍♂️ Rango Hechicero",
                aprendiz: "🧙‍♂️ Rango Aprendiz"
            };

            const embed = new EmbedBuilder()
                .setTitle("🎉 ¡Sorteo Activo!")
                .setColor("#FFD700")
                .setDescription(`Se está sorteando **${nombres[rango]}**
Duración del premio: **1 mes**

⏳ El sorteo finalizará automáticamente en **24 horas**.

Pulsa el botón para participar.`);

            const botones = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("participar")
                    .setLabel("Participar 🎉")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("finalizar")
                    .setLabel("Finalizar Sorteo")
                    .setStyle(ButtonStyle.Danger)
            );

            const msg = await interaction.reply({
                embeds: [embed],
                components: [botones],
                fetchReply: true
            });

            sorteos.set(msg.id, {
                participantes: [],
                rango: rango,
                autor: interaction.user.id
            });

            setTimeout(async () => {
                const data = sorteos.get(msg.id);
                if (!data) return;
                finalizarSorteo(interaction.guild, msg, data);
            }, 24 * 60 * 60 * 1000);
        }

        // ----------------------
        // COMANDO /SERVER
        // ----------------------
        if (interaction.commandName === "server") {

            const embed = new EmbedBuilder()
                .setTitle("🌐 Información del Servidor")
                .setColor("#8A2BE2")
                .setThumbnail("https://i.imgur.com/5c3QXQF.png")
                .setDescription("Aquí tienes los datos oficiales del servidor BloqueMágico | Network:")
                .addFields(
                    { name: "🟩 Minecraft Java", value: "**IP:** play.bloquemagico.fun" },
                    { name: "🟦 Minecraft Bedrock", value: "**IP:** mc.bloquemagico.fun\n**Puerto:** 19132" },
                    { name: "🛒 Tienda", value: "https://tienda.bloquemagico.fun/" },
                    { name: "📅 Fecha de creación", value: "6/1/2026", inline: true },
                    { name: "👥 Usuarios", value: "130", inline: true },
                    { name: "📺 Canales", value: "108", inline: true },
                    { name: "😃 Emojis", value: "😀 😎 🤖 🧙‍♂️ ✨ 🔮 🐉" }
                )
                .setFooter({ text: "BloqueMágico | Network" })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    }

    // ----------------------
    // BOTONES DEL SORTEO
    // ----------------------
    if (interaction.isButton()) {
        const data = sorteos.get(interaction.message.id);
        if (!data) return;

        if (interaction.customId === "participar") {
            if (!data.participantes.includes(interaction.user.id)) {
                data.participantes.push(interaction.user.id);
                return interaction.reply({ content: "¡Participación registrada! 🎉", ephemeral: true });
            } else {
                return interaction.reply({ content: "Ya estás participando.", ephemeral: true });
            }
        }

        if (interaction.customId === "finalizar") {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({
                    content: "❌ No tienes permisos para finalizar el sorteo.",
                    ephemeral: true
                });
            }

            finalizarSorteo(interaction.guild, interaction.message, data);
            return interaction.reply({ content: "Sorteo finalizado manualmente.", ephemeral: true });
        }
    }
});
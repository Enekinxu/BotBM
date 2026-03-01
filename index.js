require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Collection
} = require("discord.js");

// Crear REST con el token
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Crear cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Guardar participantes de cada sorteo
const sorteos = new Collection();

// ----------------------
// REGISTRO DE COMANDOS
// ----------------------
const comandos = [
    new SlashCommandBuilder()
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

    new SlashCommandBuilder()
        .setName("sorteo")
        .setDescription("Crea un sorteo de un rango temporal")
        .addStringOption(option =>
            option
                .setName("rango")
                .setDescription("Rango a sortear")
                .setRequired(true)
                .addChoices(
                    { name: "Mago", value: "mago" },
                    { name: "Manacrest", value: "manacrest" },
                    { name: "Arcano", value: "arcano" },
                    { name: "Hechicero", value: "hechicero" },
                    { name: "Aprendiz", value: "aprendiz" }
                )
        )
].map(cmd => cmd.toJSON());

client.on("ready", async () => {
    console.log(`Bot iniciado como ${client.user.tag}`);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: comandos }
        );
        console.log("Comandos registrados correctamente.");
    } catch (error) {
        console.error(error);
    }
});

// ----------------------
// RESPUESTA A COMANDOS
// ----------------------
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

        // ----------------------
        // COMANDO /SORTEO
        // ----------------------
        if (interaction.commandName === "sorteo") {
            const rango = interaction.options.getString("rango");

            const nombres = {
                mago: "🟦 Rango Mago",
                manacrest: "🟪 Rango Manacrest",
                arcano: "🟩 Rango Arcano",
                hechicero: "🟧 Rango Hechicero",
                aprendiz: "🟨 Rango Aprendiz"
            };

            const embed = new EmbedBuilder()
                .setTitle("🎉 ¡Sorteo Activo!")
                .setColor("#FFD700")
                .setDescription(
`Se está sorteando **${nombres[rango]}**  
Duración del premio: **1 mes**

Pulsa el botón para participar.`
                );

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
                rango: rango
            });
        }
    }

    // ----------------------
    // BOTONES DEL SORTEO
    // ----------------------
    if (interaction.isButton()) {
        const data = sorteos.get(interaction.message.id);
        if (!data) return;

        // Participar
        if (interaction.customId === "participar") {
            if (!data.participantes.includes(interaction.user.id)) {
                data.participantes.push(interaction.user.id);
                return interaction.reply({ content: "¡Participación registrada! 🎉", ephemeral: true });
            } else {
                return interaction.reply({ content: "Ya estás participando.", ephemeral: true });
            }
        }

        // Finalizar sorteo
        if (interaction.customId === "finalizar") {
            if (data.participantes.length === 0) {
                return interaction.reply("No hubo participantes.");
            }

            const ganador = data.participantes[Math.floor(Math.random() * data.participantes.length)];

            const rol = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === data.rango);
            if (!rol) return interaction.reply("El rol no existe.");

            const miembro = await interaction.guild.members.fetch(ganador);
            await miembro.roles.add(rol);

            setTimeout(async () => {
                await miembro.roles.remove(rol);
            }, 30 * 24 * 60 * 60 * 1000);

            const embedGanador = new EmbedBuilder()
                .setTitle("🎉 ¡Ganador del Sorteo!")
                .setColor("#00FF00")
                .setDescription(
`El ganador del sorteo es:

🏆 <@${ganador}> 🏆

Ha ganado **${data.rango}** durante **1 mes**.`
                );

            sorteos.delete(interaction.message.id);

            return interaction.reply({ embeds: [embedGanador] });
        }
    }
});

// Login
client.login(process.env.TOKEN);
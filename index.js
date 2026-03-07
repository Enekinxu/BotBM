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
    Collection,
    PermissionsBitField
} = require("discord.js");

const fs = require("fs");
let welcomer = require("./welcomer.json");

// Crear REST con el token
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Crear cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Guardar participantes de cada sorteo
const sorteos = new Collection();

// ----------------------
// IDs DE ROLES
// ----------------------
const roles = {
    mago: "ID_DEL_ROL_MAGO",
    manacrest: "ID_DEL_ROL_MANACREST",
    arcano: "ID_DEL_ROL_ARCANO",
    hechicero: "ID_DEL_ROL_HECHICERO",
    aprendiz: "ID_DEL_ROL_APRENDIZ"
};

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
        ),

    new SlashCommandBuilder()
        .setName("server")
        .setDescription("Muestra información del servidor"),

    new SlashCommandBuilder()
        .setName("welcomer")
        .setDescription("Configura el sistema de bienvenida")
        .addSubcommand(sub =>
            sub
                .setName("set")
                .setDescription("Selecciona el canal donde se enviarán las bienvenidas")
                .addChannelOption(option =>
                    option
                        .setName("canal")
                        .setDescription("Canal donde se enviarán los mensajes de bienvenida")
                        .setRequired(true)
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
        // /SERVER
        // ----------------------
        if (interaction.commandName === "server") {

            const guild = interaction.guild;

            const creado = Math.floor(guild.createdTimestamp / 1000);
            const totalMiembros = guild.memberCount;
            const humanos = guild.members.cache.filter(m => !m.user.bot).size;
            const bots = guild.members.cache.filter(m => m.user.bot).size;

            const embed = new EmbedBuilder()
                .setTitle("🌐 Información del Servidor")
                .setColor("#8A2BE2")
                .setThumbnail(guild.iconURL({ size: 1024 }))
                .addFields(
                    { name: "📛 Nombre", value: guild.name, inline: true },
                    { name: "🆔 ID", value: guild.id, inline: true },
                    {
                        name: "📅 Creado",
                        value: `<t:${creado}:F>\n<t:${creado}:R>`,
                        inline: false
                    },
                    { name: "👑 Dueño", value: `<@${guild.ownerId}>`, inline: true },
                    {
                        name: "👥 Miembros",
                        value: `Total: **${totalMiembros}**\nHumanos: **${humanos}**\nBots: **${bots}**`,
                        inline: true
                    },
                    {
                        name: "📂 Canales",
                        value: `${guild.channels.cache.size}`,
                        inline: true
                    },
                    {
                        name: "🏷️ Roles",
                        value: `${guild.roles.cache.size}`,
                        inline: true
                    },
                    {
                        name: "🚀 Boosts",
                        value: `Nivel: **${guild.premiumTier}**\nBoosts: **${guild.premiumSubscriptionCount}**`,
                        inline: true
                    }
                )
                .setFooter({ text: "BloqueMágico | Network" })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }

        // ----------------------
        // /REGLAS
        // ----------------------
        if (interaction.commandName === "reglas") {
            const tipo = interaction.options.getString("tipo");

            if (tipo === "discord") {
                const embedDiscord = new EmbedBuilder()
                    .setTitle("📘 Reglas del Servidor de Discord")
                    .setColor("#5865F2")
                    .setDescription(
`🛡️ **Normas Generales**
• Respeta a todos los miembros del servidor.
• Prohibido insultar, acosar o discriminar.
• No se permite contenido NSFW, gore o sensible.
• Evita el spam, flood o menciones innecesarias.
• Mantén un ambiente sano y amigable.

💬 **Canales de Texto**
• Escribe siempre en el canal correspondiente.
• No uses mayúsculas de forma excesiva.
• No envíes enlaces sospechosos o maliciosos.
• No promociones otros servidores sin permiso del staff.
• No compartas información personal.

🎙️ **Canales de Voz**
• Respeta los turnos de palabra.
• Evita ruidos molestos o micrófono abierto constante.
• No pongas música sin permiso del staff.
• No grabes conversaciones sin consentimiento.

👑 **Roles y Jerarquía**
• Respeta al staff y sus decisiones.
• No pidas roles especiales sin motivo.
• No abuses de permisos si tienes un rol superior.
• Los roles se asignan por participación, eventos o decisión del staff.

🎉 **Eventos y Actividades**
• Sigue las instrucciones del organizador.
• No hagas spoilers si están prohibidos.
• Participa con buena actitud.
• No interrumpas actividades en curso.

🔒 **Seguridad**
• No uses multicuentas para evadir sanciones.
• No intentes hackear, raidear o sabotear el servidor.
• Reporta cualquier comportamiento extraño al staff.
• No compartas datos personales ni contraseñas.

🧙 **Comunidad**
• Sé amable y constructivo.
• Respeta las creaciones de otros usuarios.
• Mantén el espíritu mágico de BloqueMágico.`
                    );

                return interaction.reply({ embeds: [embedDiscord] });
            }

            if (tipo === "minecraft") {
                const embedMinecraft = new EmbedBuilder()
                    .setTitle("📘 Reglas de Minecraft")
                    .setColor("#9E00FF")
                    .setDescription(
`🛡️ **Normas Generales**
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

💰 **Economía**
• No estafes.
• No dupliques objetos.
• Respeta precios oficiales.

🚫 **Técnico**
• Prohibido hacks o mods no autorizados.
• No explotes bugs.
• No hagas publicidad de otros servidores.`
                    );

                return interaction.reply({ embeds: [embedMinecraft] });
            }
        }

        // ----------------------
        // /WELCOMER SET
        // ----------------------
        if (interaction.commandName === "welcomer") {

            if (interaction.options.getSubcommand() === "set") {

                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({
                        content: "❌ Solo administradores pueden configurar el welcomer.",
                        ephemeral: true
                    });
                }

                const canal = interaction.options.getChannel("canal");

                welcomer.canal = canal.id;

                fs.writeFileSync("./welcomer.json", JSON.stringify(welcomer, null, 4));

                return interaction.reply({
                    content: `✅ Canal de bienvenida configurado en: <#${canal.id}>`,
                    ephemeral: true
                });
            }
        }

        // ----------------------
        // /SORTEO
        // ----------------------
        if (interaction.commandName === "sorteo") {
            const rango = interaction.options.getString("rango");

            const embed = new EmbedBuilder()
                .setTitle("🎉 ¡Sorteo Activo!")
                .setColor("#FFD700")
                .setDescription(`Se sortea **${rango}** durante 1 mes.`);

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

// ----------------------
// EVENTO DE BIENVENIDA
// ----------------------
client.on("guildMemberAdd", miembro => {

    const canalID = welcomer.canal;
    if (!canalID) return;

    const canal = miembro.guild.channels.cache.get(canalID);
    if (!canal) return;

    const embed = new EmbedBuilder()
        .setTitle("🎉 ¡Bienvenido a BloqueMágico!")
        .setColor("#8A2BE2")
        .setThumbnail(miembro.user.displayAvatarURL({ size: 1024 }))
        .setDescription(
`✨ ¡Hola ${miembro}!  
Bienvenido al reino mágico de **BloqueMágico | Network**.

🪄 Esperamos que disfrutes tu estancia.  
📜 Lee las reglas y únete a la aventura.`
        )
        .setTimestamp();

    canal.send({ embeds: [embed] });
});

// ----------------------
// FUNCIÓN PARA FINALIZAR SORTEO
// ----------------------
async function finalizarSorteo(guild, message, data) {

    if (data.participantes.length === 0) {
        message.reply("❌ No hubo participantes.");
        sorteos.delete(message.id);
        return;
    }

    const ganador = data.participantes[Math.floor(Math.random() * data.participantes.length)];

    const rolID = roles[data.rango];
    const rol = guild.roles.cache.get(rolID);

    if (!rol) {
        message.reply("❌ El rol configurado NO existe.");
        return;
    }

    const miembro = await guild.members.fetch(ganador);
    await miembro.roles.add(rol);

    setTimeout(async () => {
        await miembro.roles.remove(rol);
    }, 30 * 24 * 60 * 60 * 1000);

    const embedGanador = new EmbedBuilder()
        .setTitle("🎉 ¡Ganador del Sorteo!")
        .setColor("#00FF00")
        .setDescription(`🏆 <@${ganador}> ha ganado **${data.rango}** durante 1 mes.`);

    message.reply({ embeds: [embedGanador] });

    sorteos.delete(message.id);
}

// Login
client.login(process.env.TOKEN);
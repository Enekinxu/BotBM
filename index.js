require("dotenv").config();

const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    SlashCommandBuilder, 
    REST, 
    Routes 
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

// ----------------------
// REGISTRO DEL COMANDO
// ----------------------
const comandos = [
    new SlashCommandBuilder()
        .setName("reglas")
        .setDescription("Muestra las reglas del servidor")
].map(cmd => cmd.toJSON());

client.on("ready", async () => {
    console.log(`Bot iniciado como ${client.user.tag}`);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: comandos }
        );
        console.log("Comando /reglas registrado correctamente.");
    } catch (error) {
        console.error(error);
    }
});

// ----------------------
// RESPUESTA AL COMANDO
// ----------------------
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "reglasmc") {

        const embed = new EmbedBuilder()
            .setTitle("📘 Reglas de Minecraft @everyone")
            .setColor("#9E00FF")
            .setDescription(
`🛡️ **Reglas Generales del Reino**
• Respeta a todos los jugadores. No se tolera el acoso, insultos ni discriminación.
• No hagas spam ni flood en el chat.
• No uses lenguaje ofensivo o inapropiado.
• No compartas información personal.
• Sigue las instrucciones del staff o moderadores.

🧱 **Reglas de Construcción**
• No destruyas construcciones ajenas (griefing).
• Evita construcciones ofensivas o inapropiadas.
• Respeta las zonas protegidas o temáticas.
• No abuses de redstone que cause lag.

⚔️ **Reglas de PvP y Combate**
• El PvP solo está permitido en zonas habilitadas.
• No hagas spawnkill ni ataques injustos.
• Respeta los duelos y eventos organizados.
• No robes objetos tras matar a alguien sin reglas claras.

💰 **Reglas de Economía y Comercio**
• No estafes a otros jugadores.
• Respeta los precios establecidos en tiendas oficiales.
• No dupliques objetos ni uses bugs para obtener ventaja.
• Usa los canales adecuados para intercambios.

🚫 **Reglas Técnicas y de Seguridad**
• Prohibido el uso de hacks, cheats o mods no autorizados.
• No explotes bugs o glitches del servidor.
• No hagas publicidad de otros servidores.
• Reporta cualquier comportamiento sospechoso al staff.

🎉 **Reglas de Eventos y Actividades**
• Sigue las normas específicas de cada evento.
• No interrumpas ni sabotees actividades comunitarias.
• Participa con buena actitud y espíritu de equipo.`
            );

        await interaction.reply({ embeds: [embed] });
    }
});

// Login
client.login(process.env.TOKEN);
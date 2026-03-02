const comandos = [
    new SlashCommandBuilder()
        .setName("reglas")
        .setDescription("Muestra las reglas del servidor")
        .addStringOption(...),

    new SlashCommandBuilder()
        .setName("sorteo")
        .setDescription("Crea un sorteo de un rango temporal")
        .addStringOption(...),

    new SlashCommandBuilder()
        .setName("server")
        .setDescription("Muestra información del servidor Minecraft")
].map(cmd => cmd.toJSON());
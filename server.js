const comandos = [
    new SlashCommandBuilder()
        .setName("reglas")
        .setDescription("Muestra las reglas del servidor")
        .addStringOption(opt => opt.setName("regla").setDescription("Muestra las reglas del servidor").setRequired(false)),

    new SlashCommandBuilder()
        .setName("sorteo")
        .setDescription("Crea un sorteo de un rango temporal")
        .addStringOption(opt => opt.setName("rango").setDescription("Crea un sorteo de un rango temporal").setRequired(true)),

    new SlashCommandBuilder()
        .setName("server")
        .setDescription("Muestra información del servidor Discord")
].map(cmd => cmd.toJSON());
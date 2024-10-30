
require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'automatch',
        description: 'Matches with someone via AI based on your description',
        options: [
            {
                name: 'role',
                description: 'What role are you searching for? [Founder, Co-founder, CEO, Investor, Freelancer]',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'Founder',
                        value: "Founder"
                    },
                    {
                        name: 'Co-Founder',
                        value: "Co-Founder"
                    },
                    {
                        name: 'CEO',
                        value: "CEO"
                    },
                    {
                        name: 'Investor',
                        value: "Investor"
                    },
                    {
                        name: 'Freelancer',
                        value: "Freelancer"
                    }
                ],
                required: true,
            }, 

            {
                name: 'description',
                description: 'Describe exactly what person you are looking for',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commands...");
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log("Slash commands registered");
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
})();

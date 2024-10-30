const axios = require('axios');

require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const mongoose = require('mongoose');

// Role-to-channel ID mapping
const roleChannelMap = {
    'Founder': '1300016580184510525',
    'Co-Founder': '1300016823554670632',
    'CEO': '1300017045211058176',
    'Investor': '1300016953519505449',
    'Freelancer': '1300017096041955379'
};


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Message Schema for MongoDB
const messageSchema = new mongoose.Schema({
    content: String,
    authorId: String,
    authorName: String,
    channelId: String,
    timestamp: Date,
});

const Message = mongoose.model('Message', messageSchema);

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);
});

client.on('messageCreate', async (message) => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Specify the channel ID to monitor
    const targetChannelId1 = '1299367781451436093';
    const targetChannelId2 = '1300016823554670632';
    const targetChannelId3 = '1300017045211058176';
    const targetChannelId4 = '1300016953519505449';
    const targetChannelId5 = '1300017096041955379';

    if (message.channel.id === targetChannelId1 || targetChannelId2 || targetChannelId3 || targetChannelId4 || targetChannelId5) {
        // Save message to database
        const newMessage = new Message({
            content: message.content,
            authorId: message.author.id,
            authorName: message.author.username,
            channelId: message.channel.id,
            timestamp: message.createdAt,
        });

        try {
            await newMessage.save();
            console.log('Message saved to database');
        } catch (err) {
            console.error('Error saving message to database', err);
        }
    }
});

// Helper function to query OpenAI for the best match
async function getBestMatch(description, messages) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are an assistant that matches descriptions with the closest message in the database." },
                    { role: "user", content: `Here is a list of messages: ${JSON.stringify(messages)}. Find the message that best matches this description: ${description}` }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error querying OpenAI API:", error);
        return null;
    }
}



client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'automatch') {
        await interaction.deferReply();

        const role = interaction.options.getString('role');
        const description = interaction.options.getString('description');
        const targetChannelId = roleChannelMap[role];
        
        if (!targetChannelId) {
            await interaction.editReply("Invalid role selected.");
            return;
        }

        try {
            const messages = await Message.find({ channelId: targetChannelId });

            // Format messages for ChatGPT
            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                authorId: msg.authorId,
                authorName: msg.authorName
            }));

            // Get ChatGPT's best-matching response
            const bestMatchContent = await getBestMatch(description, formattedMessages);

            if (!bestMatchContent) {
                await interaction.editReply("Could not find a suitable match.");
                return;
            }

            // Find the message with the highest word overlap
            const bestMatch = formattedMessages.reduce((closestMatch, msg) => {
                const overlap = calculateWordOverlap(bestMatchContent, msg.content);
                return overlap > closestMatch.overlap ? { message: msg, overlap } : closestMatch;
            }, { message: null, overlap: 0 });

            if (bestMatch.message) {
                await interaction.editReply(`**Best match found: @${bestMatch.message.authorName}** \nIntroduction of match: \n\n${bestMatch.message.content}`);
            } else {
                await interaction.editReply("Could not find a suitable match.");
            }
        } catch (error) {
            console.error("Error fetching messages or interacting with ChatGPT:", error);
            await interaction.editReply("An error occurred while trying to find a match.");
        }
    }
});

// Helper function to calculate word overlap
function calculateWordOverlap(text1, text2) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    return [...words1].filter(word => words2.has(word)).length;
}



client.login(process.env.TOKEN);

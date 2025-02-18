# Discord Bot - Introduction Matcher

This is a Discord bot built using **discord.js** that scrapes messages from an introduction channel, processes the content using the OpenAI GPT API, and matches users based on their introductions and a user-provided prompt. The bot then returns a username and tag based on the best match. **MongoDB** is used to store the introductions for efficient retrieval and matching.

## Features

- **Message Scraping**: The bot scrapes messages from a designated introduction channel to collect user introductions.
- **MongoDB Storage**: All scraped introductions are stored in a MongoDB database for easy access and processing.
- **Prompt Matching**: Users provide a prompt describing what they are looking for in a match. The bot processes both the user prompt and the introductions via the OpenAI GPT API to find the best match.
- **Username & Tag Retrieval**: The bot returns the username and tag of the best matching user based on the provided prompt.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Ensure you have Node.js installed (v16 or later recommended).
- **MongoDB**: Ensure MongoDB is installed and running on your system or use a cloud-based MongoDB service.
- **Discord Bot Token**: You'll need a bot token from Discord. You can get it from the Discord Developer Portal.
- **OpenAI API Key**: You will need an API key from OpenAI to interact with the GPT model for processing introductions.

## Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/discord-introduction-matcher.git
cd discord-introduction-matcher
```

### Step 2: Install dependencies

Ensure you have Node.js installed, then install the required packages:

```bash
npm install
```

### Step 3: Set up the environment variables

Create a `.env` file in the root directory and add the following:

```plaintext
DISCORD_TOKEN=your_discord_bot_token
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

- Replace `your_discord_bot_token` with your Discord bot's token.
- Replace `your_mongodb_connection_string` with your MongoDB connection string (e.g., `mongodb://localhost:27017` or a MongoDB Atlas connection string).
- Replace `your_openai_api_key` with your OpenAI API key.

### Step 4: Run the bot

Once you've set up your environment, run the bot with:

```bash
node bot.js
```

Your bot will now be up and running, scraping introductions from the specified channel, processing them, and matching users based on prompts.

## How It Works

### Introduction Scraping
The bot continuously monitors a designated introduction channel on your Discord server. It scrapes the messages and stores them in MongoDB for easy retrieval.

### Storing Introductions in MongoDB
Introductions are stored in a MongoDB collection, ensuring that user data is preserved for future matching queries.

### Matching Process
The user provides a prompt that describes what they are looking for in a match. For example:

> "I am looking for a person who loves programming and gaming."

The bot compares this prompt to the scraped introductions stored in MongoDB. It processes both the prompt and the introductions using the OpenAI GPT API to identify the best match.

### Returning a Match
After processing, the bot returns the username and tag of the user whose introduction best matches the prompt. This allows users to find potential matches based on shared interests or criteria.

## Example Usage

The bot listens to an introduction channel, where users introduce themselves.

After a prompt is provided, such as:

> "I am looking for someone who loves programming and gaming."

The bot compares it with existing introductions and matches the most relevant user.

The bot will respond with something like:

```python
The best match is: Username#1234
```

## Commands

- `!match [prompt]`:
  - Matches the best introduction based on the provided prompt. For example:
  ```
  !match I'm looking for someone who enjoys coding and tech talks.
  ```

- `!help`:
  - Displays a list of available commands and instructions on how to use the bot.

## Database Structure

### MongoDB Collection: `introductions`
Each introduction is stored as a document in the `introductions` collection. The structure is as follows:

```json
{
  "_id": ObjectId("some_id"),
  "user_id": "discord_user_id",
  "username": "discord_username",
  "tag": "discord_tag",
  "introduction": "The user’s introduction message"
}
```

- `user_id`: The unique ID of the user on Discord.
- `username`: The username of the user.
- `tag`: The Discord tag (e.g., `Username#1234`).
- `introduction`: The user’s introduction message.


## Acknowledgements

- **discord.js**: For creating the framework to interact with Discord's API.
- **OpenAI GPT**: For processing the introductions and matching users.
- **MongoDB**: For storing and retrieving introductions efficiently.

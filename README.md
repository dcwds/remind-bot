# Remind Bot

Allow users to set reminders in your Discord server. Presently, this is a self-hosted solution.

## Technology

- Reminders and scheduling occur through Discord via [Discord.js](https://github.com/discordjs/discord.js/)
- Deploys to VPS via [Docker](https://github.com/docker)
- CI/CD with [GitLab](https://gitlab.com)

## Commands

All commands contain the prefix `!`. However, this can be configured within `./src/config/index.ts`. Commands also contain aliases e.g. `!r`, `!remind`, `!rl`, `!remind-list`, etc. They can be viewed in the command index files within `./src/cmds`.

- For creation, use: `!r` followed by a number and time unit e.g. `5s`, `5min`, `5d`, `5m` and finally, the reminder. `!r 5min check the pizza`
- For deletion of a single reminder, use: `!rd {remindId}`
- To list your reminders along with their IDs, use: `!rl`

## Notification

For organization purposes, I only wanted the bot posting to a single channel, which I define in the environment variable `DISCORD_REMIND_CHANNEL_ID`. The bot will listen for commands across the _entire_ server, however.

If the bot process is terminated, it _will_ requeue reminders that have a remind date in the future. Reminders that have passed their remind date while the bot was offline will notify the author that they have been missed.

## Permissions

The permissions system is fairly thin, as I'm only using this in a small server. The bot looks for a `DISCORD_POWER_ROLE_IDS` environment variable with IDs contained within quotes and separated by spaces, e.g. `"id1 id2 id3"`. These roles will be able to delete reminders authored by _anyone_.

## Storage

At present, `./src/data/reminders.json` acts as the reminder database. Reads and writes happen through the Node `fs` API. Reminders are deleted automatically once they have reminded. There is absolutely room for improvement here although it's better than sitting in memory.

## Resources

If you want to take a crack at hosting this yourself, I'd start with the following DigitalOcean articles: [Initial Server Setup with Ubuntu](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04) and [How to Install and use Docker on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04).

To get yourself a Discord bot token, which you'll need to declare as the environment variable `DISCORD_BOT_TOKEN`, check out this [bot guide](https://discordpy.readthedocs.io/en/latest/discord.html).

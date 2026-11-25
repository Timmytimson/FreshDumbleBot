# Fresh_D_Bot

A Reddit bot that quotes Fresh Dumbledore, a parody character of the fictional character Albus Dumbledore of the Harry Potter franchise, created by Coldmirror.

Runs as a [Reddit Devvit](https://developers.reddit.com/docs/) app (TypeScript). When a comment contains a trigger word, the bot replies with a random quote from the matching category.

## Project layout

- `assets/triggers.json` - category -> trigger regexes
- `assets/quotes.json` - category -> quotes
- `src/server/bot.ts` - matching, quote selection, block list
- `src/server/server.ts` - handler for the `onCommentCreate` trigger
- `devvit.json` - app configuration

## Development

```
npm install
npm test            # types, lint, unit tests, build
npm run playtest    # install in your dev subreddit and stream logs
npx devvit logs r/<subreddit> --show-timestamps
npm run publish     # submit the app for review
```

Always follow and comply with Reddit bot rules and best practices: [bottiquette](https://www.reddit.com/r/Bottiquette/wiki/bottiquette)

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
Copyright (c) 2019 Felipe Zanettini
Modified by Tim Steinbeck, 2026

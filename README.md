# XRP Man

Learn to Ledger with XRP Man. An XRP-themed Pac-Man game that teaches XRP Ledger concepts through gameplay.

![XRP Man Gameplay](/shots/xrp-man-game-preview.png)

## How It Works

You are an XRPL validator. Collect transactions, avoid the ghosts, and validate the ledger across 3 levels. Press start and go.

![Start Screen](/shots/xrp-man-home-preview.png)

Four ghosts stand in your way:

- **BTC** -- The Chaser. Slow and expensive, but never stops coming.
- **Shark** -- The Ambusher. Preys on small accounts when you least expect it.
- **Whale** -- The Wild Card. Moves markets on a whim, impossible to predict.
- **Pepe** -- The Rug Puller. Pumps 10,000% then vanishes overnight.

Grab the green glowing orbs in the corners to trigger FUD mode. All ghosts scatter and you can eat them for bonus points.

## Levels

1. **The Ledger** -- Collect XRP transactions. Gold coin dots.
2. **The DEX** -- Fill trade orders on the built-in decentralized exchange. Blue swap dots.
3. **Consensus** -- Confirm validator votes as the network reaches consensus. Green checkmark dots.

## Controls

- **Swipe**: steer on mobile
- **Arrow keys**: steer on desktop
- **Enter/Space**: start game
- **Escape**: open in-game menu

## Development

No build step needed for development. Open `debug.html` in a browser.

To build the production bundle:

```bash
bash build.sh
```

This concatenates all source files from `src/` into `pacman.js`. Then open `index.html`.

## Credits

Fork of [web-pacman](https://github.com/Alex313031/web-pacman) by Alex313031, which is based on the original Pac-Man arcade game by Namco (1980). Reverse-engineering research by Jamey Pittman and Bart Grantham. Original web remake by Shaun Williams.

XRP Man re-theme by [Grapedrop](https://github.com/realgrapedrop). A [Koi](https://koi.grapedrop.xyz) brand project.

## License

GPL-3.0 -- inherited from web-pacman. See [LICENSE](LICENSE) for details.

# XRP Man

Learn to Ledger with XRP Man. An XRP-themed Pac-Man game that teaches XRP Ledger concepts through gameplay.

![XRP Man](/shots/xrp-man-preview.png)

## Play

Swipe or use arrow keys to navigate. Collect transactions, avoid the ghosts, eat whale transactions to trigger FUD mode.

### Controls

- **Swipe**: steer on mobile
- **Arrow keys**: steer on desktop
- **Enter/Space**: start game
- **Escape**: open in-game menu

## The Game

You play as an XRPL validator collecting transactions across 3 themed levels.

### Levels

1. **The Ledger** -- Collect XRP transactions. Gold coin dots.
2. **The DEX** -- Fill trade orders on the built-in decentralized exchange. Blue swap dots.
3. **Consensus** -- Confirm validator votes as the network reaches consensus. Green checkmark dots.

### Ghosts

| Ghost | Behavior | Description |
|-------|----------|-------------|
| **BTC** | Chaser | Slow and expensive, but never stops coming |
| **Shark** | Ambusher | Preys on small accounts when you least expect it |
| **Whale** | Wild Card | Moves markets on a whim, impossible to predict |
| **Pepe** | Rug Puller | Pumps 10,000% then vanishes overnight |

### Power-Ups

Green glowing orbs in the corners are whale transactions. Eating one puts all ghosts in FUD mode -- they scatter and you can eat them for bonus points.

### Bonus Items

- **Level 1**: RLUSD coin (Ripple's stablecoin)
- **Level 2**: Gavel (SEC settlement victory)
- **Level 3**: Ledger crystal (validator crystal)

## Development

No build step needed for development. Open `debug.html` in a browser.

To build the production bundle:

```
bash build.sh
```

This concatenates all source files from `src/` into `pacman.js`. Then open `index.html`.

## Credits

Fork of [web-pacman](https://github.com/Alex313031/web-pacman) by Alex313031, which is based on the original Pac-Man arcade game by Namco (1980). Reverse-engineering research by Jamey Pittman and Bart Grantham. Original web remake by Shaun Williams.

XRP Man re-theme by [Grapedrop](https://github.com/realgrapedrop). A [Koi](https://koi.grapedrop.xyz) brand project.

## License

GPL-3.0 -- inherited from web-pacman. See [LICENSE](LICENSE) for details.

#!/bin/bash

# Build pacman.js by concatenating source files
# Then generate debug.html with individual script includes

OUTPUT="pacman.js"
debug_includes=""

# write header
cat > $OUTPUT << 'HEADER'

// Original: https://github.com/Alex313031/web-pacman
// Based on original works by Namco, GCC, and Midway.
// Research by Jamey Pittman and Bart Grantham
// Developed by Shaun Williams, Mason Borda
// Re-themed as XRP Man

(function(){
HEADER

for file in \
    inherit.js \
    sound.js \
    random.js \
    game.js \
    direction.js \
    Map.js \
    colors.js \
    mapgen.js \
    atlas.js \
    renderers.js  \
    hud.js \
    galagaStars.js \
    Button.js \
    Menu.js \
    inGameMenu.js \
    sprites.js \
    Actor.js \
    Ghost.js \
    Player.js \
    actors.js \
    targets.js \
    ghostCommander.js \
    ghostReleaser.js \
    elroyTimer.js \
    energizer.js \
    fruit.js \
    executive.js \
    states.js \
    input.js \
    cutscenes.js \
    maps.js \
    vcr.js \
    main.js
do
    echo "//@line 1 \"src/$file\"" >> $OUTPUT
    cat src/$file >> $OUTPUT
    debug_includes="$debug_includes<script src=\"src/$file\"></script>\n"
done

echo "})();" >> $OUTPUT

# update time stamp in index.html
# update timestamp — use perl to avoid sed delimiter issues
perl -pi -e "s/last updated:[^<]*/last updated: $(date '+%Y-%m-%d %H:%M:%S') -->/" index.html

# build debug.html from index.html replacing pacman.js script tag with individual includes
python3 -c "
import re
with open('index.html') as f: content = f.read()
includes = '''$debug_includes'''
content = re.sub(r'<script src=\"pacman.js\"></script>', includes.strip(), content)
with open('debug.html', 'w') as f: f.write(content)
"

echo "Build complete: $OUTPUT"

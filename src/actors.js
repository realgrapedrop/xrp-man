//////////////////////////////////////////////////////////////////////////////////////
// create all the actors

var blinky = new Ghost();
blinky.name = "btc";
blinky.color = "#F7931A";  // BTC orange
blinky.pathColor = "rgba(247,147,26,0.8)";
blinky.isVisible = true;

var pinky = new Ghost();
pinky.name = "shark";
pinky.color = "#4A5568";  // Shark dark gray
pinky.pathColor = "rgba(74,85,104,0.8)";
pinky.isVisible = true;

var inky = new Ghost();
inky.name = "whale";
inky.color = "#1E40AF";  // Whale deep blue
inky.pathColor = "rgba(30,64,175,0.8)";
inky.isVisible = true;

var clyde = new Ghost();
clyde.name = "pepe";
clyde.color = "#00B300";  // Pepe bright green
clyde.pathColor = "rgba(0,179,0,0.8)";
clyde.isVisible = true;

var pacman = new Player();
pacman.name = "xrpman";
pacman.color = "#FFD700";  // Validator gold
pacman.pathColor = "rgba(255,215,0,0.8)";

// order at which they appear in original arcade memory
// (suggests drawing/update order)
var actors = [blinky, pinky, inky, clyde, pacman];
var ghosts = [blinky, pinky, inky, clyde];

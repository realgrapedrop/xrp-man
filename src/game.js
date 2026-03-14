//////////////////////////////////////////////////////////////////////////////////////
// Game

// game modes
var GAME_PACMAN = 0;
var GAME_MSPACMAN = 1;
var GAME_COOKIE = 2;
var GAME_OTTO = 3;
var GAME_XRPMAN = 4;

var practiceMode = false;
var turboMode = false;

// current game mode — XRP Man is the only mode
var gameMode = GAME_XRPMAN;

var getGameName = (function(){
    var names = ["PAC-MAN", "MS PAC-MAN", "COOKIE-MAN","CRAZY OTTO", "XRP MAN"];
    return function(mode) {
        if (mode == undefined) {
            mode = gameMode;
        }
        return names[mode];
    };
})();

var getGameDescription = (function(){
    var desc = [
        [
            "ORIGINAL ARCADE:",
            "NAMCO (C) 1980",
            "",
            "REVERSE-ENGINEERING:",
            "JAMEY PITTMAN",
            "",
            "REMAKE:",
            "SHAUN WILLIAMS",
        ],
        [
            "ORIGINAL ARCADE ADDON:",
            "MIDWAY/GCC (C) 1981",
            "",
            "REVERSE-ENGINEERING:",
            "BART GRANTHAM",
            "",
            "REMAKE:",
            "SHAUN WILLIAMS",
        ],
        [
            "A NEW PAC-MAN GAME",
            "WITH RANDOM MAZES:",
            "SHAUN WILLIAMS (C) 2012",
            "",
            "COOKIE MONSTER DESIGN:",
            "JIM HENSON",
            "",
            "PAC-MAN CROSSOVER CONCEPT:",
            "TANG YONGFA",
        ],
        [
            "THE UNRELEASED",
            "MS. PAC-MAN PROTOTYPE:",
            "GCC (C) 1981",
            "",
            "SPRITES REFERENCED FROM",
            "STEVE GOLSON'S",
            "CAX 2012 PRESENTATION",
            "",
            "REMAKE:",
            "SHAUN WILLIAMS",
        ],
        [
            "LEARN TO LEDGER",
            "WITH XRP MAN",
            "",
            "AN XRP-THEMED PAC-MAN",
            "FORK OF WEB-PACMAN",
            "BY ALEX313031",
            "",
            "A KOI BRAND PROJECT",
            "KOI.GRAPEDROP.XYZ",
        ],
    ];

    return function(mode) {
        if (mode == undefined) {
            mode = gameMode;
        }
        return desc[mode];
    };
})();

var getGhostNames = function(mode) {
    if (mode == undefined) {
        mode = gameMode;
    }
    if (mode == GAME_XRPMAN) {
        return ["btc","shark","whale","pepe"];
    }
    else if (mode == GAME_OTTO) {
        return ["plato","darwin","freud","newton"];
    }
    else if (mode == GAME_MSPACMAN) {
        return ["blinky","pinky","inky","sue"];
    }
    else if (mode == GAME_PACMAN) {
        return ["blinky","pinky","inky","clyde"];
    }
    else if (mode == GAME_COOKIE) {
        return ["elmo","piggy","rosita","zoe"];
    }
};

var getGhostDrawFunc = function(mode) {
    if (mode == undefined) {
        mode = gameMode;
    }
    if (mode == GAME_XRPMAN) {
        return atlas.drawXRPGhostSprite;
    }
    else if (mode == GAME_OTTO) {
        return atlas.drawMonsterSprite;
    }
    else if (mode == GAME_COOKIE) {
        return atlas.drawMuppetSprite;
    }
    else {
        return atlas.drawGhostSprite;
    }
};

var getPlayerDrawFunc = function(mode) {
    if (mode == undefined) {
        mode = gameMode;
    }
    if (mode == GAME_XRPMAN) {
        return atlas.drawXRPManSprite;
    }
    else if (mode == GAME_OTTO) {
        return atlas.drawOttoSprite;
    }
    else if (mode == GAME_PACMAN) {
        return atlas.drawPacmanSprite;
    }
    else if (mode == GAME_MSPACMAN) {
        return atlas.drawMsPacmanSprite;
    }
    else if (mode == GAME_COOKIE) {
        return drawCookiemanSprite;
    }
};


// for clearing, backing up, and restoring cheat states (before and after cutscenes presently)
var clearCheats, backupCheats, restoreCheats;
(function(){
    clearCheats = function() {
        pacman.invincible = false;
        pacman.ai = false;
        for (i=0; i<5; i++) {
            actors[i].isDrawPath = false;
            actors[i].isDrawTarget = false;
        }
        executive.setUpdatesPerSecond(60);
    };

    var i, invincible, ai, isDrawPath, isDrawTarget;
    isDrawPath = {};
    isDrawTarget = {};
    backupCheats = function() {
        invincible = pacman.invincible;
        ai = pacman.ai;
        for (i=0; i<5; i++) {
            isDrawPath[i] = actors[i].isDrawPath;
            isDrawTarget[i] = actors[i].isDrawTarget;
        }
    };
    restoreCheats = function() {
        pacman.invincible = invincible;
        pacman.ai = ai;
        for (i=0; i<5; i++) {
            actors[i].isDrawPath = isDrawPath[i];
            actors[i].isDrawTarget = isDrawTarget[i];
        }
    };
})();

// current level, lives, and score
var level = 1;
var extraLives = 0;

// XRP Man level configuration
var xrpLevelCount = 3;
var xrpLevelNames = ["THE LEDGER", "THE DEX", "CONSENSUS"];

var getXRPLevelName = function() {
    if (level >= 1 && level <= xrpLevelCount) {
        return xrpLevelNames[level-1];
    }
    return xrpLevelNames[0];
};

// XRP Man level facts (shown between levels)
var xrpLevelFacts = [
    "THE XRP LEDGER VALIDATES TRANSACTIONS IN 3-5 SECONDS",
    "THE XRPL HAS A BUILT-IN DEX. TRADE ANY TOKEN DIRECTLY ON THE LEDGER",
    "NO MINING. XRP USES CONSENSUS. 150+ VALIDATORS AGREE ON EVERY LEDGER",
];

// Ghost house transaction ticker data
var xrpTransactions = [
    // Level 1: The Ledger (mixed families)
    [
        { text: 'Pay 50 XRP', color: '#3fb950' },
        { text: 'Pay 200 XRP', color: '#3fb950' },
        { text: 'Escrow 1K XRP', color: '#3fb950' },
        { text: 'EscrowFinish', color: '#3fb950' },
        { text: 'Check 85 XRP', color: '#3fb950' },
        { text: 'PayChan Fund', color: '#3fb950' },
        { text: 'Offer XRP/USD', color: '#58a6ff' },
        { text: 'Offer XRP/RLUSD', color: '#58a6ff' },
        { text: 'Offer XRP/PEPE', color: '#58a6ff' },
        { text: 'Offer XRP/DOGE', color: '#58a6ff' },
        { text: 'OfferCancel', color: '#58a6ff' },
        { text: 'AMM Deposit', color: '#58a6ff' },
        { text: 'AMM Withdraw', color: '#58a6ff' },
        { text: 'Mint NFT', color: '#d29922' },
        { text: 'Burn NFT', color: '#d29922' },
        { text: 'NFT Offer', color: '#d29922' },
        { text: 'NFT Accept', color: '#d29922' },
        { text: 'Trust RLUSD', color: '#bc8cff' },
        { text: 'Trust SOLO', color: '#bc8cff' },
        { text: 'AccountSet', color: '#bc8cff' },
        { text: 'SignerListSet', color: '#bc8cff' },
    ],
    // Level 2: The DEX
    [
        { text: 'BUY XRP/USD', color: '#58a6ff' },
        { text: 'SELL XRP/RLUSD', color: '#58a6ff' },
        { text: 'BUY XRP/SOLO', color: '#58a6ff' },
        { text: 'SELL XRP/USD', color: '#58a6ff' },
        { text: 'BID XRP/DOGE', color: '#58a6ff' },
        { text: 'BID XRP/PEPE', color: '#58a6ff' },
        { text: 'AMM XRP>SOLO', color: '#58a6ff' },
        { text: 'AMM XRP>RLUSD', color: '#58a6ff' },
        { text: 'NEW OFFER', color: '#58a6ff' },
        { text: 'FILL 100%', color: '#3fb950' },
        { text: 'FILL 75%', color: '#3fb950' },
        { text: 'OFFER MATCHED', color: '#3fb950' },
        { text: 'PARTIAL FILL', color: '#d29922' },
        { text: 'CANCEL ORDER', color: '#d29922' },
    ],
    // Level 3: Consensus
    [
        { text: 'nHB..5a3 YES', color: '#3fb950' },
        { text: 'nHU..e71 YES', color: '#3fb950' },
        { text: 'nHD..f29 YES', color: '#3fb950' },
        { text: 'nHK..a44 YES', color: '#3fb950' },
        { text: 'nHS..b82 YES', color: '#3fb950' },
        { text: 'VALIDATED', color: '#3fb950' },
        { text: 'LEDGER CLOSED', color: '#3fb950' },
        { text: 'LGR #95.4M OK', color: '#3fb950' },
        { text: '152/158 AGREE', color: '#58a6ff' },
        { text: '155/158 AGREE', color: '#58a6ff' },
        { text: 'CONSENSUS MET', color: '#58a6ff' },
        { text: 'ROUND 4.1s', color: '#bc8cff' },
    ],
];

// Current transaction ticker state
var xrpCurrentTx = null;
var xrpTickerUpdate = function() {
    var lvl = Math.min(level, xrpLevelCount) - 1;
    if (lvl < 0) lvl = 0;
    var pool = xrpTransactions[lvl];
    xrpCurrentTx = pool[Math.floor(Math.random() * pool.length)];
};

// VCR functions

var savedLevel = {};
var savedExtraLives = {};
var savedHighScore = {};
var savedScore = {};
var savedState = {};

var saveGame = function(t) {
    savedLevel[t] = level;
    savedExtraLives[t] = extraLives;
    savedHighScore[t] = getHighScore();
    savedScore[t] = getScore();
    savedState[t] = state;
};
var loadGame = function(t) {
    level = savedLevel[t];
    if (extraLives != savedExtraLives[t]) {
        extraLives = savedExtraLives[t];
        renderer.drawMap();
    }
    setHighScore(savedHighScore[t]);
    setScore(savedScore[t]);
    state = savedState[t];
};

/// SCORING
// (manages scores and high scores for each game type)

var scores = [
    0,0, // pacman
    0,0, // mspac
    0,0, // cookie
    0,0, // otto
    0,0, // xrpman
    0 ];
var highScores = [
    10000,10000, // pacman
    10000,10000, // mspac
    10000,10000, // cookie
    10000,10000, // otto
    10000,10000, // xrpman
    ];

var getScoreIndex = function() {
    if (practiceMode) {
        return 10;
    }
    return gameMode*2 + (turboMode ? 1 : 0);
};

// handle a score increment
var addScore = function(p) {

    // get current scores
    var score = getScore();

    // handle extra life at 10000 points
    if (score < 10000 && score+p >= 10000) {
        extraLives++;
        renderer.drawMap();
    }

    score += p;
    setScore(score);

    if (!practiceMode) {
        if (score > getHighScore()) {
            setHighScore(score);
        }
    }
};

var getScore = function() {
    return scores[getScoreIndex()];
};
var setScore = function(score) {
    scores[getScoreIndex()] = score;
};

var getHighScore = function() {
    return highScores[getScoreIndex()];
};
var setHighScore = function(highScore) {
    highScores[getScoreIndex()] = highScore;
    saveHighScores();
};
// High Score Persistence

var loadHighScores = function() {
    var hs;
    var hslen;
    var i;
    if (localStorage && localStorage.highScores) {
        hs = JSON.parse(localStorage.highScores);
        hslen = hs.length;
        for (i=0; i<hslen; i++) {
            highScores[i] = Math.max(highScores[i],hs[i]);
        }
    }
};
var saveHighScores = function() {
    if (localStorage) {
        localStorage.highScores = JSON.stringify(highScores);
    }
};

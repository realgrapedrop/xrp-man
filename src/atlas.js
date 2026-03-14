
var atlas = (function(){

    var canvas,ctx;
    var size = 22;
    var cols = 14; // has to be ONE MORE than intended to fix some sort of CHROME BUG (last cell always blank?)
    var rows = 22;

    var creates = 0;

    var drawGrid = function() {
        // draw grid overlay
        var canvas = document.getElementById('gridcanvas');
        if (!canvas) {
            return;
        }
        var w = size*cols*renderScale;
        var h = size*rows*renderScale;
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,w,h);
        var x,y;
        var step = size*renderScale;
        ctx.beginPath();
        for (x=0; x<=w; x+=step) {
            ctx.moveTo(x,0);
            ctx.lineTo(x,h);
        }
        for (y=0; y<=h; y+=step) {
            ctx.moveTo(0,y);
            ctx.lineTo(w,y);
        }
        ctx.lineWidth = "1px";
        ctx.lineCap = "square";
        ctx.strokeStyle="rgba(255,255,255,0.5)";
        ctx.stroke();
    };

    var create = function() {
        drawGrid();
        canvas = document.getElementById('atlas');
        ctx = canvas.getContext("2d");
        /*
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.style.position = "absolute";
        */

        var w = size*cols*renderScale;
        var h = size*rows*renderScale;
        canvas.width = w;
        canvas.height = h;

        if (creates > 0) {
            ctx.restore();
        }
        creates++;

        ctx.save();
        ctx.clearRect(0,0,w,h);
        ctx.scale(renderScale,renderScale);

        var drawAtCell = function(f,row,col) {
            var x = col*size + size/2;
            var y = row*size + size/2;
            f(x,y);
        };

        var row = 0;
        drawAtCell(function(x,y) { drawCherry(ctx,x,y); },      row,0);
        drawAtCell(function(x,y) { drawStrawberry(ctx,x,y); },  row,1);
        drawAtCell(function(x,y) { drawOrange(ctx,x,y); },      row,2);
        drawAtCell(function(x,y) { drawApple(ctx,x,y); },       row,3);
        drawAtCell(function(x,y) { drawMelon(ctx,x,y); },       row,4);
        drawAtCell(function(x,y) { drawGalaxian(ctx,x,y); },    row,5);
        drawAtCell(function(x,y) { drawBell(ctx,x,y); },        row,6);
        drawAtCell(function(x,y) { drawKey(ctx,x,y); },         row,7);
        drawAtCell(function(x,y) { drawPretzel(ctx,x,y); },     row,8);
        drawAtCell(function(x,y) { drawPear(ctx,x,y); },        row,9);
        drawAtCell(function(x,y) { drawBanana(ctx,x,y); },      row,10);
        drawAtCell(function(x,y) { drawCookie(ctx,x,y); },      row,11);
        drawAtCell(function(x,y) { drawCookieFlash(ctx,x,y); },      row,12);

        var drawGhostCells = function(row,color) {
            var i,f;
            var col = 0;
            for (i=0; i<4; i++) { // dirEnum
                for (f=0; f<2; f++) { // frame
                    drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, f, i, false, false, false, color); },   row,col);
                    col++;
                }
            }
        };

        row++;
        drawGhostCells(row, "#FF0000");
        row++;
        drawGhostCells(row, "#FFB8FF");
        row++;
        drawGhostCells(row, "#00FFFF");
        row++;
        drawGhostCells(row, "#FFB851");

        row++;
        // draw disembodied eyes
        (function(){
            var i;
            var col = 0;
            for (i=0; i<4; i++) { // dirEnum
                drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 0, i, false, false, true, "#fff"); },     row,col);
                col++;
            }
        })();

        // draw ghosts scared
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 0, DIR_UP, true, false, false, "#fff"); }, row,4);
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 1, DIR_UP, true, false, false, "#fff"); }, row,5);
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 0, DIR_UP, true, true, false, "#fff"); },  row,6);
        drawAtCell(function(x,y) { drawGhostSprite(ctx, x,y, 1, DIR_UP, true, true, false, "#fff"); },  row,7);

        var drawPacCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawPacmanSprite(ctx, x,y, dir, Math.PI/6); }, row, col);
            drawAtCell(function(x,y) { drawPacmanSprite(ctx, x,y, dir, Math.PI/3); }, row, col+1);
        };
        row++;

        // draw pacman mouth closed
        drawAtCell(function(x,y) { drawPacmanSprite(ctx, x,y, DIR_RIGHT, 0); }, row, 0);

        // draw pacman directions
        (function(){
            var i;
            var col=1;
            for (i=0; i<4; i++) {
                drawPacCells(row,col,i);
                col+=2;
            }
        })();

        var drawMsPacCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawMsPacmanSprite(ctx, x,y, dir, 0); }, row, col);
            drawAtCell(function(x,y) { drawMsPacmanSprite(ctx, x,y, dir, 1); }, row, col+1);
            drawAtCell(function(x,y) { drawMsPacmanSprite(ctx, x,y, dir, 2); }, row, col+2);
        };
        row++;
        (function(){
            var i;
            var col=0;
            for (i=0; i<4; i++) {
                drawMsPacCells(row,col,i);
                col+=3;
            }
        })();

        var drawCookieCells = function(row,col,dir) {
            drawAtCell(function(x,y) { drawCookiemanSprite(ctx, x,y, dir, 0, true); }, row, col);
            drawAtCell(function(x,y) { drawCookiemanSprite(ctx, x,y, dir, 1, true); }, row, col+1);
            drawAtCell(function(x,y) { drawCookiemanSprite(ctx, x,y, dir, 2, true); }, row, col+2);
        };
        row++;
        (function(){
            var i;
            var col=0;
            for (i=0; i<4; i++) {
                drawCookieCells(row,col,i);
                col+=3;
            }
        })();

        var drawMonsterCells = function(row,color) {
            var i,f;
            var col=0;
            for (i=0; i<4; i++) { // dirEnum
                for (f=0; f<2; f++) { // frame
                    drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, f, i, false, false, false, color); },   row,col);
                    col++;
                }
            }
        };

        row++;
        drawMonsterCells(row, "#FF0000");
        row++;
        drawMonsterCells(row, "#FFB8FF");
        row++;
        drawMonsterCells(row, "#00FFFF");
        row++;
        drawMonsterCells(row, "#FFB851");

        row++;
        (function(){
            var i;
            var col = 0;
            for (i=0; i<4; i++) { // dirEnum
                drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 0, i, false, false, true, "#fff"); },     row,col);
                col++;
            }
        })();
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 0, DIR_UP, true, false, false, "#fff"); }, row,4);
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 1, DIR_UP, true, false, false, "#fff"); }, row,5);
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 0, DIR_UP, true, true, false, "#fff"); },  row,6);
        drawAtCell(function(x,y) { drawMonsterSprite(ctx, x,y, 1, DIR_UP, true, true, false, "#fff"); },  row,7);

        var drawOttoCells = function(row,col,dir) {
            var i;
            for (i=0; i<4; i++) { // frame
                drawAtCell(function(x,y) { drawOttoSprite(ctx, x,y, dir, i); }, row, col);
                col++;
            }
        };
        row++;
        drawOttoCells(row,0, DIR_UP);
        drawOttoCells(row,4, DIR_RIGHT);
        row++;
        drawOttoCells(row,0, DIR_DOWN);
        drawOttoCells(row,4, DIR_LEFT);

        row++;
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 200, "#33ffff"); }, row, 0);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 400, "#33ffff"); }, row, 1);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 800, "#33ffff"); }, row, 2);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 1600, "#33ffff");}, row, 3);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 100, "#ffb8ff"); }, row, 4);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 300, "#ffb8ff"); }, row, 5);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 500, "#ffb8ff"); }, row, 6);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 700, "#ffb8ff"); }, row, 7);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 1000, "#ffb8ff"); }, row, 8);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 2000, "#ffb8ff"); }, row, 9);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 3000, "#ffb8ff"); }, row, 10);
        drawAtCell(function(x,y) { drawPacPoints(ctx, x,y, 5000, "#ffb8ff"); }, row, 11);
        row++;
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 100, "#fff"); }, row, 0);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 200, "#fff"); }, row, 1);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 500, "#fff"); }, row, 2);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 700, "#fff"); }, row, 3);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 1000, "#fff"); }, row, 4);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 2000, "#fff"); }, row, 5);
        drawAtCell(function(x,y) { drawMsPacPoints(ctx, x,y, 5000, "#fff"); }, row, 6);

        row++;
        drawAtCell(function(x,y) {
            drawSnail(ctx,x,y, "#0ff");
        }, row, 0);
        drawAtCell(function(x,y) {
            drawSnail(ctx,x,y, "#FFF");
        }, row, 1);

        var drawMsOttoCells = function(row,col,dir) {
            var i;
            for (i=0; i<4; i++) { // frame
                drawAtCell(function(x,y) { drawMsOttoSprite(ctx, x,y, dir, i); }, row, col);
                col++;
            }
        };
        row++;
        drawMsOttoCells(row,0, DIR_UP);
        drawMsOttoCells(row,4, DIR_RIGHT);
        row++;
        drawMsOttoCells(row,0, DIR_DOWN);
        drawMsOttoCells(row,4, DIR_LEFT);

    };

    var copyCellTo = function(row, col, destCtx, x, y,display) {
        var sx = col*size*renderScale;
        var sy = row*size*renderScale;
        var sw = renderScale*size;
        var sh = renderScale*size;

        var dx = x - size/2;
        var dy = y - size/2;
        var dw = size;
        var dh = size;

        if (display) {
            console.log(sx,sy,sw,sh,dw,dy,dw,dh);
        }

        destCtx.drawImage(canvas,sx,sy,sw,sh,dx,dy,dw,dh);
    };

    var copyGhostPoints = function(destCtx,x,y,points) {
        var row = 16;
        var col = {
            200: 0,
            400: 1,
            800: 2,
            1600: 3,
        }[points];
        if (col != undefined) {
            copyCellTo(row, col, destCtx, x, y);
        }
    };

    var copyPacFruitPoints = function(destCtx,x,y,points) {
        var row = 16;
        var col = {
            100: 4,
            300: 5,
            500: 6,
            700: 7,
            1000: 8,
            2000: 9,
            3000: 10,
            5000: 11,
        }[points];
        if (col != undefined) {
            copyCellTo(row, col, destCtx, x, y);
        }
    };

    var copyMsPacFruitPoints = function(destCtx,x,y,points) {
        var row = 17;
        var col = {
            100: 0,
            200: 1,
            500: 2,
            700: 3,
            1000: 4,
            2000: 5,
            5000: 6,
        }[points];
        if (col != undefined) {
            copyCellTo(row, col, destCtx, x, y);
        }
    };

    var copyGhostSprite = function(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color) {
        var row,col;
        if (eyes_only) {
            row = 5;
            col = dirEnum;
        }
        else if (scared) {
            row = 5;
            col = flash ? 6 : 4;
            col += frame;
        }
        else {
            col = dirEnum*2 + frame;
            if (color == blinky.color) {
                row = 1;
            }
            else if (color == pinky.color) {
                row = 2;
            }
            else if (color == inky.color) {
                row = 3;
            }
            else if (color == clyde.color) {
                row = 4;
            }
            else {
                row = 5;
            }
        }

        copyCellTo(row, col, destCtx, x, y);
    };

    var copyMuppetSprite = function(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color) {
        if (scared) {
            if (flash) {
                copyFruitSprite(destCtx,x,y,"cookieface");
            }
            else {
                copyFruitSprite(destCtx,x,y,"cookie");
            }
        }
        else {
            copyGhostSprite(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color);
        }
    };

    var copyMonsterSprite = function(destCtx,x,y,frame,dirEnum,scared,flash,eyes_only,color) {
        var row,col;
        if (eyes_only) {
            row = 13;
            col = dirEnum;
        }
        else if (scared) {
            row = 13;
            col = flash ? 6 : 4;
            col += frame;
        }
        else {
            col = dirEnum*2 + frame;
            if (color == blinky.color) {
                row = 9;
            }
            else if (color == pinky.color) {
                row = 10;
            }
            else if (color == inky.color) {
                row = 11;
            }
            else if (color == clyde.color) {
                row = 12;
            }
            else {
                row = 13;
            }
        }

        copyCellTo(row, col, destCtx, x, y);
    };

    var copyOttoSprite = function(destCtx,x,y,dirEnum,frame) {
        var col,row;
        if (dirEnum == DIR_UP) {
            col = frame;
            row = 14;
        }
        else if (dirEnum == DIR_RIGHT) {
            col = frame+4;
            row = 14;
        }
        else if (dirEnum == DIR_DOWN) {
            col = frame;
            row = 15;
        }
        else if (dirEnum == DIR_LEFT) {
            col = frame+4;
            row = 15;
        }
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyMsOttoSprite = function(destCtx,x,y,dirEnum,frame) {
        var col,row;
        if (dirEnum == DIR_UP) {
            col = frame;
            row = 19;
        }
        else if (dirEnum == DIR_RIGHT) {
            col = frame+4;
            row = 19;
        }
        else if (dirEnum == DIR_DOWN) {
            col = frame;
            row = 20;
        }
        else if (dirEnum == DIR_LEFT) {
            col = frame+4;
            row = 20;
        }
        copyCellTo(row,col,destCtx,x,y);
    };

    var copySnail = function(destCtx,x,y,frame) {
        var row = 18;
        var col = frame;
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyPacmanSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 6;
        var col;
        if (frame == 0) {
            col = 0;
        }
        else {
           col = dirEnum*2+1+(frame-1);
        }
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyMsPacmanSprite = function(destCtx,x,y,dirEnum,frame) {
        // TODO: determine row, col
        //copyCellTo(row,col,destCtx,x,y);
        var row = 7;
        var col = dirEnum*3+frame;
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyCookiemanSprite = function(destCtx,x,y,dirEnum,frame) {
        var row = 8;
        var col = dirEnum*3+frame;
        copyCellTo(row,col,destCtx,x,y);
    };

    var copyFruitSprite = function(destCtx,x,y,name) {
        var row = 0;
        var col = {
            "cherry": 0,
            "strawberry": 1,
            "orange": 2,
            "apple": 3,
            "melon": 4,
            "galaxian": 5,
            "bell": 6,
            "key": 7,
            "pretzel": 8,
            "pear": 9,
            "banana": 10,
            "cookie": 11,
            "cookieface": 12,
        }[name];

        copyCellTo(row,col,destCtx,x,y);
    };

    // XRP Man ghost sprite: draws directly to context (not from atlas cache)
    var drawXRPGhostDirect = function(destCtx, x, y, frame, dirEnum, scared, flash, eyes_only, color) {
        if (scared || eyes_only) {
            // Use standard ghost sprite for scared/eyes states
            copyGhostSprite(destCtx, x, y, frame, dirEnum, scared, flash, eyes_only, color);
            return;
        }

        destCtx.save();
        destCtx.translate(x, y);

        var s = size/2 * 0.8; // half-size
        var w = s;
        var h = s * 1.1;

        // Ghost body
        destCtx.beginPath();
        destCtx.arc(0, -h*0.15, w, Math.PI, 0);
        destCtx.lineTo(w, h*0.55);
        var segments = 4;
        var waveAmp = frame ? 0.35 : 0.55;
        for (var i = 0; i < segments; i++) {
            var startX = w - (i * w * 2 / segments);
            var midX = startX - w / segments;
            var endX = startX - w * 2 / segments;
            destCtx.quadraticCurveTo(midX, h*waveAmp, endX, h*0.55);
        }
        destCtx.closePath();
        destCtx.fillStyle = color;
        destCtx.fill();

        // Ghost-specific features based on color
        if (color == blinky.color) {
            // BTC: white bitcoin symbol on forehead
            destCtx.fillStyle = '#FFF';
            destCtx.font = 'bold 7px sans-serif';
            destCtx.textAlign = 'center';
            destCtx.textBaseline = 'middle';
            destCtx.fillText('\u20BF', 0, -h*0.55);
        }
        else if (color == pinky.color) {
            // Shark: light inner body + dorsal fin
            destCtx.beginPath();
            destCtx.arc(0, -h*0.15, w*0.6, Math.PI, 0);
            destCtx.lineTo(w*0.6, h*0.3);
            destCtx.lineTo(-w*0.6, h*0.3);
            destCtx.closePath();
            destCtx.fillStyle = '#A8B8C8';
            destCtx.fill();
            // Fin
            destCtx.beginPath();
            destCtx.moveTo(-1, -h*0.55);
            destCtx.lineTo(2, -h*1.1);
            destCtx.lineTo(5, -h*0.45);
            destCtx.closePath();
            destCtx.fillStyle = '#5A6A7A';
            destCtx.fill();
        }
        else if (color == inky.color) {
            // Whale: lighter belly + water spout
            destCtx.beginPath();
            destCtx.ellipse(0, h*0.1, w*0.55, h*0.18, 0, 0, Math.PI);
            destCtx.fillStyle = '#3B6FDF';
            destCtx.fill();
            // Water spout
            destCtx.strokeStyle = '#5B8FFF';
            destCtx.lineWidth = 0.8;
            destCtx.beginPath(); destCtx.moveTo(0, -h*0.6); destCtx.lineTo(-1.5, -h*0.85); destCtx.stroke();
            destCtx.beginPath(); destCtx.moveTo(0, -h*0.6); destCtx.lineTo(1.5, -h*0.85); destCtx.stroke();
            destCtx.beginPath(); destCtx.moveTo(0, -h*0.6); destCtx.lineTo(0, -h*0.9); destCtx.stroke();
        }
        else if (color == clyde.color) {
            // Pepe: lighter belly
            destCtx.beginPath();
            destCtx.ellipse(0, h*0.1, w*0.55, h*0.2, 0, 0, Math.PI);
            destCtx.fillStyle = '#66DD66';
            destCtx.fill();
        }

        // Eyes
        var ex = 0;
        if (dirEnum == DIR_LEFT) ex = -1.5;
        else if (dirEnum == DIR_RIGHT) ex = 1.5;
        var ey = 0;
        if (dirEnum == DIR_UP) ey = -1.5;
        else if (dirEnum == DIR_DOWN) ey = 1.5;

        if (color == clyde.color) {
            // Pepe: big frog eyes with half-closed lids
            destCtx.fillStyle = '#FFF';
            destCtx.beginPath(); destCtx.arc(-3.5, -3, 3.5, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.arc(3.5, -3, 3.5, 0, Math.PI*2); destCtx.fill();
            destCtx.fillStyle = '#111';
            destCtx.beginPath(); destCtx.arc(-3.5+ex, -3+ey, 1.5, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.arc(3.5+ex, -3+ey, 1.5, 0, Math.PI*2); destCtx.fill();
            // Droopy lids
            destCtx.fillStyle = color;
            destCtx.beginPath(); destCtx.ellipse(-3.5, -5, 4, 2.5, 0, 0, Math.PI); destCtx.fill();
            destCtx.beginPath(); destCtx.ellipse(3.5, -5, 4, 2.5, 0, 0, Math.PI); destCtx.fill();
            // Smug grin
            destCtx.strokeStyle = '#005500';
            destCtx.lineWidth = 1;
            destCtx.beginPath(); destCtx.arc(0, 2, 4.5, 0.1, Math.PI-0.1); destCtx.stroke();
        }
        else if (color == inky.color) {
            // Whale: big round eyes
            destCtx.fillStyle = '#FFF';
            destCtx.beginPath(); destCtx.arc(-3.5, -1, 3.5, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.arc(3.5, -1, 3.5, 0, Math.PI*2); destCtx.fill();
            destCtx.fillStyle = '#1A1A3A';
            destCtx.beginPath(); destCtx.arc(-3.5+ex, -1+ey, 1.8, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.arc(3.5+ex, -1+ey, 1.8, 0, Math.PI*2); destCtx.fill();
        }
        else if (color == pinky.color) {
            // Shark: slightly narrow eyes
            destCtx.fillStyle = '#FFF';
            destCtx.beginPath(); destCtx.ellipse(-3.5, -1, 3.2, 2.5, 0, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.ellipse(3.5, -1, 3.2, 2.5, 0, 0, Math.PI*2); destCtx.fill();
            destCtx.fillStyle = '#111';
            destCtx.beginPath(); destCtx.arc(-3.5+ex, -0.5+ey, 1.5, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.arc(3.5+ex, -0.5+ey, 1.5, 0, Math.PI*2); destCtx.fill();
        }
        else {
            // BTC and default: standard round eyes
            destCtx.fillStyle = '#FFF';
            destCtx.beginPath(); destCtx.arc(-3.5, -1, 3, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.arc(3.5, -1, 3, 0, Math.PI*2); destCtx.fill();
            destCtx.fillStyle = '#1A1AFF';
            destCtx.beginPath(); destCtx.arc(-3.5+ex, -1+ey, 1.5, 0, Math.PI*2); destCtx.fill();
            destCtx.beginPath(); destCtx.arc(3.5+ex, -1+ey, 1.5, 0, Math.PI*2); destCtx.fill();
        }

        destCtx.restore();
    };

    // XRP Man player sprite: draws directly to context
    var drawXRPManDirect = function(destCtx, x, y, dirEnum, frame, isFullDraw) {
        destCtx.save();
        destCtx.translate(x, y);

        var r = size/2 * 0.75;

        // Determine mouth angle from frame
        var mouthAngle;
        if (typeof frame === 'number') {
            if (frame == 0) mouthAngle = 0;
            else if (frame == 1) mouthAngle = Math.PI/6;
            else mouthAngle = Math.PI/3;
        } else {
            mouthAngle = frame || 0; // frame can be angle directly
        }

        // Rotation based on direction
        var rot = 0;
        if (dirEnum == DIR_RIGHT) rot = 0;
        else if (dirEnum == DIR_DOWN) rot = Math.PI/2;
        else if (dirEnum == DIR_LEFT) rot = Math.PI;
        else if (dirEnum == DIR_UP) rot = -Math.PI/2;

        destCtx.rotate(rot);

        // Draw pac-man body with gold gradient
        destCtx.beginPath();
        destCtx.arc(0, 0, r, mouthAngle, 2*Math.PI - mouthAngle);
        destCtx.lineTo(0, 0);
        destCtx.closePath();

        var grad = destCtx.createRadialGradient(-1, -1, 0, 0, 0, r);
        grad.addColorStop(0, '#FFE566');
        grad.addColorStop(0.4, '#FFD700');
        grad.addColorStop(1, '#CC9900');
        destCtx.fillStyle = grad;
        destCtx.fill();

        // Draw {X} validator symbol (only when mouth is not wide open)
        if (mouthAngle < Math.PI/2) {
            destCtx.strokeStyle = '#664400';
            destCtx.lineWidth = 0.8;
            destCtx.lineCap = 'round';

            // X in center (XRP bowtie) — simplified for small size
            var xs = r * 0.35;
            destCtx.beginPath(); destCtx.moveTo(-xs, -xs); destCtx.lineTo(0, -1); destCtx.stroke();
            destCtx.beginPath(); destCtx.moveTo(xs, -xs); destCtx.lineTo(0, -1); destCtx.stroke();
            destCtx.beginPath(); destCtx.moveTo(0, 1); destCtx.lineTo(-xs, xs); destCtx.stroke();
            destCtx.beginPath(); destCtx.moveTo(0, 1); destCtx.lineTo(xs, xs); destCtx.stroke();
        }

        destCtx.restore();
    };

    return {
        create: create,
        getCanvas: function() { return canvas; },
        drawGhostSprite: copyGhostSprite,
        drawMonsterSprite: copyMonsterSprite,
        drawMuppetSprite: copyMuppetSprite,
        drawOttoSprite: copyOttoSprite,
        drawMsOttoSprite: copyMsOttoSprite,
        drawPacmanSprite: copyPacmanSprite,
        drawMsPacmanSprite: copyMsPacmanSprite,
        drawCookiemanSprite: copyCookiemanSprite,
        drawFruitSprite: copyFruitSprite,
        drawGhostPoints: copyGhostPoints,
        drawPacFruitPoints: copyPacFruitPoints,
        drawMsPacFruitPoints: copyMsPacFruitPoints,
        drawSnail: copySnail,
        drawXRPGhostSprite: drawXRPGhostDirect,
        drawXRPManSprite: drawXRPManDirect,
    };
})();

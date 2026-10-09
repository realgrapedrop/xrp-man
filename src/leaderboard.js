//////////////////////////////////////////////////////////////////////////////////////
// Leaderboard
// (shared top 10 high scores; a top 10 score can be claimed with an X handle)
//
// The board lives on the XRP Blaster server (xrp-blaster.grapedrop.xyz), which keeps a
// separate "xrpman" board. Every call fails quietly: with no API the game plays the same.

var leaderboard = (function() {

    var API = (location.hostname == "localhost" || location.hostname == "127.0.0.1")
        ? "http://127.0.0.1:4311/api"           // local dev: XRP Blaster's server.py on port 4311
        : "https://xrp-blaster.grapedrop.xyz/api";
    var GAME = "xrpman";
    var HANDLE_RE = /^@?[A-Za-z0-9_]{1,15}$/;

    // 80s high score table: ordinals and a color per rank
    var RANK_LABELS = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH"];
    var RANK_COLORS = ["#FFFFFF", "#FF4545", "#FFB347", "#FFD9A8", "#FFD9A8", "#FF8FC0", "#4DFF7C", "#4DFF7C", "#4FD8FF", "#4DFF7C"];

    var board = [];
    var session = null;
    var pending = null;     // the finished game waiting for a handle: {score, level, done}
    var ui = null;

    var post = function(path, body) {
        return fetch(API + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }).then(function(res) {
            return res.json().catch(function() { return {}; }).then(function(data) {
                data.httpOk = res.ok;
                return data;
            });
        });
    };

    var fetchBoard = function() {
        return fetch(API + "/scores?game=" + GAME, { cache: "no-store" })
            .then(function(res) { return res.ok ? res.json() : null; })
            .then(function(data) { if (data && Array.isArray(data.top)) board = data.top; })
            .catch(function() {});
    };

    var savedHandle = function() {
        try { return localStorage.xrpmanHandle || ""; } catch (e) { return ""; }
    };
    var saveHandle = function(h) {
        try { localStorage.xrpmanHandle = h; } catch (e) {}
    };

    // The claim panel is plain HTML over the canvas, so phones get a real keyboard.
    var build = function() {
        if (ui) return ui;
        var style = document.createElement("style");
        style.textContent =
            "#lb-claim{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:10;" +
            "width:min(340px,calc(100% - 32px));background:#000;border:2px solid #FFD700;" +
            "box-shadow:0 0 24px rgba(255,215,0,.35);padding:18px;text-align:center;" +
            "font-family:ArcadeR,'Courier New',monospace;color:#FFF;touch-action:manipulation}" +
            "#lb-claim[hidden]{display:none}" +
            "#lb-claim h2{color:#FFD700;font-size:20px;font-weight:normal;margin:0 0 6px}" +
            "#lb-claim p{margin:6px 0;font-size:11px;line-height:1.5}" +
            "#lb-claim .sub{color:#0088CC}" +
            "#lb-claim .msg{color:#3fb950;min-height:1.5em}" +
            "#lb-claim form{display:flex;gap:8px;margin:12px 0 8px}" +
            "#lb-claim form[hidden]{display:none}" +
            "#lb-claim input{flex:1;min-width:0;background:#000;color:#FFF;border:1px solid #555;" +
            "font:16px 'Courier New',monospace;padding:8px;-webkit-user-select:text;user-select:text}" +
            "#lb-claim input:focus{outline:none;border-color:#FFD700}" +
            "#lb-claim button{font-family:inherit;font-size:11px;padding:8px 12px;cursor:pointer;" +
            "background:#000;color:#FFD700;border:1px solid #FFD700}" +
            "#lb-claim button.close{color:#888;border-color:#555;width:100%}";
        document.head.appendChild(style);

        var panel = document.createElement("div");
        panel.id = "lb-claim";
        panel.hidden = true;
        panel.innerHTML =
            '<h2>TOP 10!</h2>' +
            '<p class="sub">CLAIM YOUR SPOT</p>' +
            '<p class="score"></p>' +
            '<form autocomplete="off">' +
            '<input type="text" maxlength="16" placeholder="@yourXhandle" aria-label="Your X handle" ' +
            'autocapitalize="off" autocorrect="off" spellcheck="false" required>' +
            '<button type="submit">CLAIM</button>' +
            '</form>' +
            '<p class="msg"></p>' +
            '<button type="button" class="close">SKIP</button>';
        document.body.appendChild(panel);

        ui = {
            panel: panel,
            score: panel.querySelector(".score"),
            form: panel.querySelector("form"),
            input: panel.querySelector("input"),
            claim: panel.querySelector("form button"),
            msg: panel.querySelector(".msg"),
            close: panel.querySelector(".close"),
        };
        ui.form.addEventListener("submit", function(e) {
            e.preventDefault();
            claim();
        });
        ui.close.addEventListener("click", function() { hide(); });
        return ui;
    };

    var open = function() {
        build();
        ui.score.textContent = "SCORE " + pending.score;
        ui.input.value = savedHandle();
        ui.msg.textContent = "";
        ui.form.hidden = false;
        ui.claim.disabled = false;
        ui.close.textContent = "SKIP";
        ui.panel.hidden = false;
    };

    var hide = function() {
        pending = null;
        if (!ui) return;
        if (document.activeElement && ui.panel.contains(document.activeElement)) document.activeElement.blur();
        ui.panel.hidden = true;
    };

    var claim = function() {
        var handle = ui.input.value.trim();
        if (!HANDLE_RE.test(handle)) {
            ui.msg.textContent = "X HANDLES ARE 1 TO 15 LETTERS, NUMBERS OR _";
            return;
        }
        if (!pending || !session) return;
        ui.claim.disabled = true;
        post("/scores", {
            game: GAME, token: session, handle: handle,
            score: pending.score, level: pending.level, done: pending.done,
        }).then(function(data) {
            if (!data.httpOk || !data.ok) {
                ui.msg.textContent = (data.error || "COULD NOT SAVE THAT. TRY AGAIN.").toUpperCase();
                ui.claim.disabled = false;
                return;
            }
            var name = "@" + handle.replace(/^@/, "");
            saveHandle(name);
            session = null;
            if (Array.isArray(data.top)) board = data.top;
            ui.form.hidden = true;
            ui.close.textContent = "DONE";
            ui.msg.textContent = data.improved && data.rank
                ? name.toUpperCase() + " IS #" + data.rank + " ON THE BOARD"
                : data.rank ? name.toUpperCase() + " ALREADY HAS A BETTER SCORE AT #" + data.rank : "SAVED";
        }).catch(function() {
            ui.msg.textContent = "COULD NOT REACH THE BOARD. TRY AGAIN.";
            ui.claim.disabled = false;
        });
    };

    return {
        // the claim panel is up: game starts wait until it closes
        isOpen: function() { return !!(ui && !ui.panel.hidden); },
        // this event belongs to the claim panel, not the game
        owns: function(target) { return !!(ui && target instanceof Node && ui.panel.contains(target)); },
        refresh: fetchBoard,

        startGame: function() {
            session = null;
            hide();
            post("/session", { game: GAME }).then(function(data) {
                if (data.httpOk && typeof data.token == "string") session = data.token;
            }).catch(function() {});
        },

        endGame: function(score, lvl, done) {
            if (!session || !(score > 0)) return;
            var finished = { score: score, level: Math.max(1, Math.min(3, lvl)), done: !!done };
            fetchBoard().then(function() {
                var last = board[board.length - 1];
                if (board.length < 10 || score > last.score) {
                    pending = finished;
                    open();
                }
            });
        },

        // Drawn on the home screen under the ghost showcase, in map coordinates.
        draw: function(ctx, top) {
            var size = tileSize - 2;
            var step = 1.15 * tileSize;
            var rankX = 2 * tileSize;
            var scoreX = 12 * tileSize;
            var nameX = 13 * tileSize;
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.font = (tileSize - 1) + "px ArcadeR";
            ctx.fillStyle = "#FFD700";
            ctx.fillText("HIGH SCORES", mapWidth / 2, top);

            ctx.font = size + "px ArcadeR";
            var head = top + 1.6 * tileSize;
            ctx.fillStyle = "#FFE14D";
            ctx.textAlign = "left";
            ctx.fillText("RANK", rankX, head);
            ctx.textAlign = "right";
            ctx.fillText("SCORE", scoreX, head);
            ctx.textAlign = "left";
            ctx.fillText("NAME", nameX, head);

            for (var i = 0; i < 10; i++) {
                var e = board[i];
                var y = head + 1.4 * tileSize + i * step;
                ctx.globalAlpha = e ? 1 : 0.35;     // empty ranks stay on the table, dimmed
                ctx.fillStyle = RANK_COLORS[i];
                ctx.textAlign = "left";
                ctx.fillText(RANK_LABELS[i], rankX, y);
                ctx.textAlign = "right";
                ctx.fillText(e ? String(e.score) : "-----", scoreX, y);
                ctx.textAlign = "left";
                ctx.fillText(e ? "@" + e.handle.toUpperCase() : "---", nameX, y);
            }
            ctx.globalAlpha = 1;
        },
    };
})();

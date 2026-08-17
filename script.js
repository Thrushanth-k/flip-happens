/* =========================================
   VARIABLES
========================================= */

let selectedSide = "Heads";

let wins = 0;
let streak = 0;
let flips = 0;

let isFlipping = false;

let soundEnabled = true;

let audioContext = null;


/* =========================================
   ELEMENTS
========================================= */

const coin =
    document.getElementById("coin");

const coinSymbol =
    document.getElementById("coinSymbol");

const coinText =
    document.getElementById("coinText");

const headsBtn =
    document.getElementById("headsBtn");

const tailsBtn =
    document.getElementById("tailsBtn");

const flipBtn =
    document.getElementById("flipBtn");

const soundBtn =
    document.getElementById("soundBtn");

const resetBtn =
    document.getElementById("resetBtn");

const result =
    document.getElementById("result");

const playerToggle =
    document.getElementById("playerToggle");

const playerSection =
    document.getElementById("playerSection");

const player1 =
    document.getElementById("player1");

const player2 =
    document.getElementById("player2");

const winsDisplay =
    document.getElementById("wins");

const streakDisplay =
    document.getElementById("streak");

const flipsDisplay =
    document.getElementById("flips");

const celebration =
    document.getElementById("celebration");

const winnerOverlay =
    document.getElementById("winnerOverlay");

const winnerName =
    document.getElementById("winnerName");

const closeWinner =
    document.getElementById("closeWinner");


/* =========================================
   AUDIO
========================================= */

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();
    }
}


function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.08
) {

    if (!soundEnabled)
        return;

    initAudio();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.value =
        frequency;

    gain.gain.setValueAtTime(
        0,
        audioContext.currentTime
    );

    gain.gain.linearRampToValueAtTime(
        volume,
        audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );
}


function playClickSound() {

    playTone(
        650,
        0.08,
        "sine",
        0.05
    );
}


function playCoinFlipSound() {

    if (!soundEnabled)
        return;

    initAudio();

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        setTimeout(
            () => {

                playTone(
                    420 + i * 55,
                    0.12,
                    "triangle",
                    0.06
                );

            },
            i * 150
        );
    }
}


function playCoinLandSound() {

    if (!soundEnabled)
        return;

    playTone(
        180,
        0.25,
        "triangle",
        0.15
    );

    setTimeout(
        () => {

            playTone(
                330,
                0.15,
                "sine",
                0.07
            );

        },
        70
    );
}


function playWinSound() {

    if (!soundEnabled)
        return;

    const notes = [
        523,
        659,
        784,
        1047
    ];

    notes.forEach(
        (note, index) => {

            setTimeout(
                () => {

                    playTone(
                        note,
                        0.3,
                        "sine",
                        0.1
                    );

                },
                index * 100
            );
        }
    );
}


function playLoseSound() {

    if (!soundEnabled)
        return;

    playTone(
        300,
        0.35,
        "sawtooth",
        0.05
    );

    setTimeout(
        () => {

            playTone(
                190,
                0.4,
                "sawtooth",
                0.04
            );

        },
        150
    );
}


/* =========================================
   COIN FACE
========================================= */

function setCoinFace(side) {

    if (side === "Heads") {

        coinSymbol.textContent =
            "H";

        coinText.textContent =
            "HEADS";

    } else {

        coinSymbol.textContent =
            "T";

        coinText.textContent =
            "TAILS";
    }
}


/* =========================================
   CONTROLS
========================================= */

function setControls(enabled) {

    headsBtn.disabled =
        !enabled;

    tailsBtn.disabled =
        !enabled;

    flipBtn.disabled =
        !enabled;

    playerToggle.disabled =
        !enabled;

    resetBtn.disabled =
        !enabled;
}


/* =========================================
   HEADS
========================================= */

headsBtn.addEventListener(
    "click",
    () => {

        if (isFlipping)
            return;

        initAudio();

        playClickSound();

        selectedSide =
            "Heads";

        headsBtn.classList.add(
            "active"
        );

        tailsBtn.classList.remove(
            "active"
        );

        result.textContent =
            "You selected Heads";
    }
);


/* =========================================
   TAILS
========================================= */

tailsBtn.addEventListener(
    "click",
    () => {

        if (isFlipping)
            return;

        initAudio();

        playClickSound();

        selectedSide =
            "Tails";

        tailsBtn.classList.add(
            "active"
        );

        headsBtn.classList.remove(
            "active"
        );

        result.textContent =
            "You selected Tails";
    }
);


/* =========================================
   PLAYER MODE
========================================= */

playerToggle.addEventListener(
    "click",
    () => {

        if (isFlipping)
            return;

        initAudio();

        playClickSound();

        playerSection.classList.toggle(
            "hidden"
        );

        if (
            playerSection.classList.contains(
                "hidden"
            )
        ) {

            playerToggle.textContent =
                "👥 Add 2 Players";

        } else {

            playerToggle.textContent =
                "✖ Hide Players";
        }
    }
);


/* =========================================
   SOUND
========================================= */

soundBtn.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;

        if (soundEnabled) {

            soundBtn.textContent =
                "🔊 Sound On";

            initAudio();

            playClickSound();

        } else {

            soundBtn.textContent =
                "🔇 Sound Off";
        }
    }
);


/* =========================================
   FLIP
========================================= */

flipBtn.addEventListener(
    "click",
    () => {

        if (isFlipping)
            return;

        isFlipping = true;

        setControls(false);

        initAudio();

        result.classList.remove(
            "winner",
            "loser-result"
        );

        result.textContent =
            "🪙 Flipping...";

        playCoinFlipSound();


        coin.classList.remove(
            "flipping",
            "land",
            "loser"
        );

        void coin.offsetWidth;


        const coinResult =
            Math.random() < 0.5
                ? "Heads"
                : "Tails";


        coin.classList.add(
            "flipping"
        );


        setTimeout(
            () => {

                coin.classList.remove(
                    "flipping"
                );

                setCoinFace(
                    coinResult
                );

                coin.classList.add(
                    "land"
                );


                setTimeout(
                    () => {

                        coin.classList.remove(
                            "land"
                        );

                    },
                    350
                );


                playCoinLandSound();

                finishFlip(
                    coinResult
                );

            },
            2600
        );
    }
);


/* =========================================
   FINISH FLIP
========================================= */

function finishFlip(
    coinResult
) {

    flips++;

    flipsDisplay.textContent =
        flips;


    const name1 =
        player1.value.trim();

    const name2 =
        player2.value.trim();


    /* =====================================
       TWO PLAYER MODE
    ===================================== */

    if (
        name1 !== "" &&
        name2 !== ""
    ) {

        const winner =
            coinResult === "Heads"
                ? name1
                : name2;


        wins++;

        streak++;


        winsDisplay.textContent =
            wins;

        streakDisplay.textContent =
            streak;


        result.innerHTML =
            "🏆 " +
            winner +
            " wins the toss!";


        result.classList.add(
            "winner"
        );


        playWinSound();

        celebrate();


        setTimeout(
            () => {

                showWinnerPopup(
                    winner
                );

            },
            450
        );

    }


    /* =====================================
       NORMAL MODE
    ===================================== */

    else {

        if (
            selectedSide ===
            coinResult
        ) {

            wins++;

            streak++;


            winsDisplay.textContent =
                wins;

            streakDisplay.textContent =
                streak;


            result.innerHTML =
                "🎉 You Won!" +
                "<small>It's " +
                coinResult +
                "</small>";


            result.classList.add(
                "winner"
            );


            playWinSound();

            celebrate();

        } else {

            streak = 0;

            streakDisplay.textContent =
                streak;


            result.innerHTML =
                "You Lose!" +
                "<small>It's " +
                coinResult +
                "</small>";


            result.classList.add(
                "loser-result"
            );


            playLoseSound();


            coin.classList.remove(
                "loser"
            );

            void coin.offsetWidth;

            coin.classList.add(
                "loser"
            );


            setTimeout(
                () => {

                    coin.classList.remove(
                        "loser"
                    );

                },
                900
            );
        }
    }


    isFlipping = false;

    setControls(true);
}


/* =========================================
   WINNER POPUP
========================================= */

function showWinnerPopup(
    name
) {

    winnerName.textContent =
        name;

    winnerOverlay.classList.add(
        "show"
    );
}


/* =========================================
   CLOSE WINNER
========================================= */

closeWinner.addEventListener(
    "click",
    () => {

        winnerOverlay.classList.remove(
            "show"
        );
    }
);


/* =========================================
   RESET GAME
========================================= */

resetBtn.addEventListener(
    "click",
    () => {

        if (isFlipping)
            return;


        initAudio();

        playClickSound();


        /* RESET VALUES */

        wins = 0;

        streak = 0;

        flips = 0;

        selectedSide =
            "Heads";


        /* RESET SCORE */

        winsDisplay.textContent =
            "0";

        streakDisplay.textContent =
            "0";

        flipsDisplay.textContent =
            "0";


        /* RESET SELECTION */

        headsBtn.classList.add(
            "active"
        );

        tailsBtn.classList.remove(
            "active"
        );


        /* RESET COIN */

        coin.classList.remove(
            "flipping",
            "land",
            "loser"
        );

        coin.style.transform =
            "";

        setCoinFace(
            "Heads"
        );


        /* RESET RESULT */

        result.classList.remove(
            "winner",
            "loser-result"
        );

        result.textContent =
            "Choose Heads or Tails";


        /* CLOSE POPUP */

        winnerOverlay.classList.remove(
            "show"
        );


        /* REMOVE CELEBRATION */

        celebration.innerHTML =
            "";


        setControls(true);

    }
);


/* =========================================
   CELEBRATION
========================================= */

function celebrate() {

    celebration.innerHTML =
        "";


    /* CONFETTI */

    for (
        let i = 0;
        i < 100;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );

        piece.className =
            "confetti";


        const colors = [
            "#ff4d6d",
            "#ffd166",
            "#06d6a0",
            "#4cc9f0",
            "#8b7cff",
            "#ffffff",
            "#ff9f1c"
        ];


        piece.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        piece.style.left =
            Math.random() * 100 +
            "%";


        piece.style.width =
            6 +
            Math.random() * 7 +
            "px";


        piece.style.height =
            10 +
            Math.random() * 12 +
            "px";


        piece.style.setProperty(
            "--fall-time",
            2 +
            Math.random() * 2 +
            "s"
        );


        celebration.appendChild(
            piece
        );
    }


    createPopper("left");

    createPopper("right");

    createSparkBurst();
}


/* =========================================
   POPPER PAPERS
========================================= */

function createPopper(
    side
) {

    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const paper =
            document.createElement(
                "div"
            );

        paper.className =
            "popper-paper";


        const colors = [
            "#ff4d6d",
            "#ffd166",
            "#06d6a0",
            "#4cc9f0",
            "#8b7cff",
            "#ffffff",
            "#ff9f1c"
        ];


        paper.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        let startX;
        let endX;


        if (
            side === "left"
        ) {

            startX =
                -30 -
                Math.random() * 40;

            endX =
                100 +
                Math.random() * 500;

        } else {

            startX =
                window.innerWidth +
                30 +
                Math.random() * 40;

            endX =
                window.innerWidth -
                100 -
                Math.random() * 500;
        }


        const startY =
            window.innerHeight *
            (
                0.55 +
                Math.random() * 0.1
            );


        const midX =
            side === "left"
                ? 150 +
                  Math.random() * 350
                : window.innerWidth -
                  150 -
                  Math.random() * 350;


        const midY =
            window.innerHeight *
            (
                0.1 +
                Math.random() * 0.3
            );


        const endY =
            window.innerHeight *
            (
                0.45 +
                Math.random() * 0.25
            );


        paper.style.setProperty(
            "--start-x",
            startX + "px"
        );

        paper.style.setProperty(
            "--start-y",
            startY + "px"
        );

        paper.style.setProperty(
            "--mid-x",
            midX + "px"
        );

        paper.style.setProperty(
            "--mid-y",
            midY + "px"
        );

        paper.style.setProperty(
            "--end-x",
            endX + "px"
        );

        paper.style.setProperty(
            "--end-y",
            endY + "px"
        );


        paper.style.animationDelay =
            Math.random() * 0.3 +
            "s";


        celebration.appendChild(
            paper
        );
    }
}


/* =========================================
   SPARK BURST
========================================= */

function createSparkBurst() {

    const centerX =
        window.innerWidth / 2;

    const centerY =
        window.innerHeight / 2;


    for (
        let i = 0;
        i < 50;
        i++
    ) {

        const spark =
            document.createElement(
                "div"
            );

        spark.className =
            "spark";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            80 +
            Math.random() * 240;


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        spark.style.left =
            centerX + "px";

        spark.style.top =
            centerY + "px";


        spark.style.setProperty(
            "--x",
            x + "px"
        );

        spark.style.setProperty(
            "--y",
            y + "px"
        );


        celebration.appendChild(
            spark
        );
    }
}
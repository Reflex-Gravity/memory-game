/**
 * @author joeldsouza
 */

function GameEngine() {

    //  Private variables
    var coloredSquares = []
    var selectedSquares = []
    var maxWaitTime = 3000; // Maximum buffer time.
    var isDisabledClicks = true;
    // var isDummyState = true;

    const GAME_OVER_MSG = 'Game Over';
    const GAME_WIN_MSG = 'Congrats. You Won'

    this.init = function () {

        // Define all the elements 
        this.gameArena = document.getElementById("arena")
        this.modalEl = document.getElementById("options-modal")
        this.counterEl = document.getElementById("counter")
        this.resultEl = document.getElementById("result")
        this.noticeEl = document.getElementById("notice")
        this.startBtn = document.getElementById("start-btn")
        this.quitBtn = document.getElementById("quit-btn")
        this.difficultySel = document.getElementById("difficulty")

        this.registerEvents()

        // Generate dummy grid.
        this.beginGame(false)

    };

    this.beginGame = function (startGame = true) {
        // Reset all values.
        startGame && this.resetGame();

        ;[this.m, this.n] = this.getDifficulty()
        this.maxTime = 10000; // Total ms to finish a game.
        this.totalSquares = this.m * this.n;
        this.minColoredSquare = 3;

        // Starts game logic.
        this.renderGame(startGame)

        startGame && this.initiateGame()
    }

    /**
     * Returns the grid size based on a difficulty level.
     *
     * @param {String} difficulty
     * @returns {Array} gridSize
     */
    this.getDifficulty = function () {

        let difficulty = this.difficultySel.value

        switch (difficulty) {
            case 'easy':
                return [3, 3]
            case 'medium':
                return [5, 5]
            case 'hard':
                return [6, 6]
            default:
                return [5, 5]
        }
    };

    /**
     * Generates and Renders the grid layout.
     *  @param {Boolean} isDummyState
     */
    this.renderGame = function (gamePlayState = true) {

        // Render the game layout
        let boxEl = ''
        coloredSquares = [];
        
        for (let boxId = 1; boxId <= this.totalSquares; boxId++) {
            let isRed = false;

            if(gamePlayState) {
                
                // Generate a random number between totalSquares and minSquares.
                const randomBoxId = Math.floor(Math.random() * (this.totalSquares - (this.minColoredSquare + 1))) + this.minColoredSquare;
    
                // If the random num is even, then it's a red box.
                if(randomBoxId%2 == 0) {
                    coloredSquares = [
                        ...coloredSquares,
                        boxId
                    ];
                    isRed = true
                }
            }

            boxEl += `<div
                        class="box ${ isRed ? 'red' : 'blue'}"
                        data-val="${boxId}"
                        onclick="window.GameInst.validateGuess(this, ${boxId})"
                    ></div>`
        }

        // Calculate the dimensions of each box i.e: (TotalWidth - (padding * m)) / m
        const boxDim = (this.gameArena.clientWidth - (10 * this.m)) / this.m

        this.gameArena.style.gridTemplateRows = `repeat(${this.m}, ${boxDim}px)`
        this.gameArena.style.gridTemplateColumns = `repeat(${this.n}, ${boxDim}px)`
        this.gameArena.innerHTML = boxEl;
    };

    /**
     * The game begins here
     *
     */
    this.initiateGame = function () {
        
        let countdown = maxWaitTime/1000;      
        this.noticeEl.innerHTML = `${countdown}`  

        // Start the wait countdown
        let waitCountdown = setInterval(() => {
            countdown = countdown - 1;
            this.noticeEl.innerHTML = `${countdown}`

            // Start the game countdown
            if(countdown === 0) {
                this.noticeEl.innerHTML = `Go!!`
                clearInterval(waitCountdown)
                this.noticeEl.innerHTML = ''
                this.startCountdown()
                this.clearBoxes()
                // Enable clicks on the boxes
                isDisabledClicks = false;
            }
        }, 1000);

    };

    /**
     * Starts the game countdown
     *
     */
    this.startCountdown = function () {

        var countdown = this.maxTime/1000

        this.quitBtn.classList.remove('hide')
        this.counterEl.classList.remove('hide')
        this.counterEl.innerText = countdown;

        this.counterListener = setInterval(() => {
            countdown = countdown - 1;
            this.counterEl.innerText = countdown;

            // Time's up.
            if(countdown === 0) {
                clearInterval(this.counterListener)
                this.stopGame()
            }
        }, 1000);
    };

    /**
     * Checks if the clicked box is a red or a blue square.
     *
     */
    this.validateGuess = function (boxEl, boxId) {

        if(isDisabledClicks) return false;

        if (coloredSquares.includes(boxId)) {
            selectedSquares = [...selectedSquares, boxId]
            boxEl.classList.add('red')
            boxEl.removeAttribute('onclick')

            // If all squares are selected.
            if(coloredSquares.length === selectedSquares.length) {
                this.stopGame()
            }

        } else {
            this.stopGame()
        }
        
    };

    /**
     * Called after a game stops.
     *
     */
    this.stopGame = function () {
        let isWon = false
        // Hide the quit button
        this.quitBtn.classList.add('hide')
        this.counterEl.classList.add('hide')

        if (Array.isArray(selectedSquares)) {
            if (selectedSquares.length === coloredSquares.length) {
                for (const _boxId of coloredSquares) {
                    if (!selectedSquares.includes(_boxId)) {
                        this.showModal(GAME_OVER_MSG, false)
                        break;
                    } else {
                        isWon = true
                    }
                }
            } else {
                isWon = false
            }
        }

        if(isWon) {
            this.showModal(GAME_WIN_MSG, true)
        } else{
            this.showModal(GAME_OVER_MSG, false)
        }
        
        isDummyState = true
        this.clearAllTimers()
    }

    /**
     * Turns all boxes into white.
     *
     */
    this.clearBoxes = function () {

        var boxes = document.querySelectorAll(".box")
        boxes.forEach(_box => {
            _box.classList.remove('red')
            _box.classList.remove('blue')
            _box.classList.add('white')
        })
    }

    /**
     * Displays the option modal.
     * 
     * @param {String} message
     * @param {Boolean} isWon
     *
     */
    this.showModal = function (message, isWon) {

        //  Show the options modal
        let messageModal = `<span>${message}</span>`;
        this.resultEl.innerHTML = messageModal
        isWon && this.resultEl.classList.add('won')
        this.modalEl.classList.remove('hide')

    };

    this.clearAllTimers = function() {
        // Clear all timers
        clearInterval(this.counterListener)
        clearInterval(this.waitCountdown)
    }

    /**
     * Clears the layout, Resets all counters.
     *
     */
    this.resetGame = function () {

        this.clearAllTimers()

        // Set default values
        coloredSquares = []
        selectedSquares = []
        isDisabledClicks = true
        
        // All elements empty
        this.counterEl.innerText = ''
        this.resultEl.innerHTML = ''
        this.gameArena.innerHTML = ''
        this.noticeEl.innerHTML = ''

        // Set default classes
        this.modalEl.classList.add('hide')
        this.resultEl.classList.remove('won')

        // Hide start btn and show retry button.
        this.startBtn.innerText = 'Retry'
    };

    this.registerEvents = function () {
        // Register all events here.
        this.startBtn.addEventListener("click", () => this.beginGame())
        this.quitBtn.addEventListener("click", () => this.stopGame())
        this.difficultySel.addEventListener("change", () => this.beginGame(false))
    };
}

// Load the game
window.GameInst = new GameEngine()
window.GameInst.init()
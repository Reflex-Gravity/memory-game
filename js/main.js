/**
 * @author joeldsouza
 */

function GameEngine() {

    //  Private variables
    var coloredSquares = []
    var selectedSquares = []
    var maxWaitTime = 3000; // Maximum buffer time.

    this.init = function () {

        // Initialize the game

        // Get elements 
        this.gameArena = document.getElementById("arena")
        this.modalEl = document.getElementById("options-modal")
        this.counterEl = document.getElementById("counter")
        this.resultEl = document.getElementById("result")
        this.startBtn = document.getElementById("start-btn")
        this.restartBtn = document.getElementById("restart-btn")

        this.registerEvents()
    };

    this.beginGame = function () {
        // Reset all values.
        this.resetGame();
        ;[this.m, this.n] = this.getDifficulty()
        this.maxTime = 2000; // Total ms to finish a game.
        this.totalSquares = this.m * this.n;
        this.minColoredSquare = 3;

        // Creates a new game
        this.generateRedSquares()
        this.renderLayout()
        this.initiateGame()
    }

    /**
     * Returns the grid size based on a difficulty level.
     *
     * @param {String} difficulty
     * @returns {Array} gridSize
     */
    this.getDifficulty = function () {

        let difficulty = document.getElementById("difficulty").value

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
     *
     *
     */
    this.renderGame = function () {

        // Render the changes to the dom.
        let el = document.getElementById("game-app")
        el.innerHTML = "Game renders here"
    };
    /**
     *  Generates red sqaures.
     *
     */
    this.generateRedSquares = function () {

        // The brain of the game.
        coloredSquares = [];

        //Randomly select the red squares.
        for (let start = 0; start <= this.totalSquares / 2; start++) {

            const randomBoxId = Math.floor(Math.random() * this.totalSquares) + this.minColoredSquare;

            if(!coloredSquares.includes(randomBoxId)) {
                coloredSquares = [
                    ...coloredSquares,
                    randomBoxId
                ];
            }
        }
        
    };

    /**
     * Generates and Renders the grid layout.
     *
     */
    this.renderLayout = function () {

        // Render the game layout
        let boxEl = ''
        for (let boxId = 0; boxId <= this.totalSquares; boxId++) {
            boxEl += `<div
                        id="box_${boxId}"
                        class="box ${coloredSquares.includes(boxId) ? 'red' : 'blue'}"
                        data-val="${boxId}"
                        onclick="window.GameInst.validateGuess(${boxId})"
                    ></div>`
        }

        // Calculate the dimensions of each box i.e: (Total )
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
        this.freezeTimeout = setTimeout(() => {
            this.clearBoxes()
            this.startCountdown()
        }, maxWaitTime);
    };

    /**
     * Starts the game countdown
     *
     */
    this.startCountdown = function () {


        clearTimeout(this.freezeTimeout)

        var countdown = 10
        this.counterListener = setInterval(() => {
            countdown = countdown - 1;
            this.counterEl.innerText = countdown;
        }, 1000);

        this.gameCountDown = setTimeout(() => {
            this.stopGame()
        }, this.maxTime)
    };

    /**
     * Checks if the clicked box is a red or a blue square.
     *
     */
    this.validateGuess = function (boxId) {
        if (coloredSquares.includes(boxId)) {
            selectedSquares = [...selectedSquares, boxId]
        } else {
            this.stopGame()
        }
        
    }

    /**
     * Called after a game stops.
     *
     */
    this.stopGame = function () {
        let isWon = false
        if (Array.isArray(selectedSquares)) {
            if (selectedSquares.length === coloredSquares.length) {
                for (const _boxId of coloredSquares) {
                    if (!selectedSquares.includes(_boxId)) {
                        this.showModal('Game Over!', false)
                        break;
                    } else {
                        isWon = true
                    }
                }
            } else {
                this.showModal('Game Over!', false)
                isWon = false
            }
        }

        if(isWon) {
            this.showModal('Congrats. You Won!', true)
        } else{
            this.showModal('Game Over!', false)
        }
        clearInterval(this.counterListener)
        clearTimeout(this.gameCountDown)
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

    this.restartGame = function () {
        this.modalEl.classList.add('hide')
        this.beginGame()
    };

    /**
     * Clears the layout, Resets all counters.
     *
     */
    this.resetGame = function () {

        // Clear all timers
        clearInterval(this.counterListener)
        clearTimeout(this.gameCountDown)

        // Set default values
        coloredSquares = []
        selectedSquares = []
        
        // All elements empty
        this.counterEl.innerText = ''
        this.resultEl.innerHTML = ''
        this.gameArena.innerHTML = ''

        // Set default classes
        this.modalEl.classList.add('hide')
        this.resultEl.classList.remove('won')
    };

    this.registerEvents = function () {
        // Register all events here.
        this.startBtn.addEventListener("click", () => this.beginGame())
        this.restartBtn.addEventListener("click", () => this.restartGame())
    };
}

// Load the game
window.GameInst = new GameEngine()
window.GameInst.init()
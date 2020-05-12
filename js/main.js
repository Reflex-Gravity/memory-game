/**
 * @author joeldsouza
 */

 function GameEngine (){
    this.init = function(difficulty="medium") {
        
        // Initialize
        // Default
        this.getDifficulty(difficulty)
        this.m = 5;
        this.n = 5;
        this.maxTime = 10000; // Total ms to finish a game.
        this.totalSquares = this.m * this.n;
        this.minColoredSquare = 3;

        // Get elements 
        this.gameArena = document.getElementById("arena")
        this.modalEl = document.getElementById("options-modal")
        this.counterEl = document.getElementById("counter")

        this.registerEvents()

        // Creates a new game
        this.generateSquares()
    };
    /**
     * Returns the grid size based on a difficulty level.
     *
     * @param {String} difficulty
     * @returns {Array} gridSize
     */
    this.getDifficulty = function(difficulty) {
        
        switch (difficulty) {
            case 'easy':
                return [3,3]
            case 'medium':
                return [5,5]
            case 'hard':
                return [6,6]
            default:
                return [5,5]
        }
    };
    /**
     *
     *
     */
    this.renderGame = function() {
        
        // Render the changes to the dom.
        let el = document.getElementById("game-app")
        el.innerHTML = "Game renders here"
    };
    /**
     *  Generates red sqaures.
     *
     */
    this.generateSquares = function() {
        
        // The brain of the game.
        this.coloredSquares = [];

        //Randomly select the red squares.
        for(let start=0; start<=this.totalSquares/2; start++) {

            this.coloredSquares = [
                ...this.coloredSquares,
                Math.floor(Math.random() * this.totalSquares) + this.minColoredSquare
            ];
        }

        this.renderLayout()
    };

    /**
     * Generates and Renders the grid layout.
     *
     */
    this.renderLayout = function() {
        
        // Render the game layout
        let boxEl = ''
        for(let start=0; start<=this.totalSquares; start++) {
            boxEl += `<div
                        class="box ${this.coloredSquares.includes(start) ? 'red' : 'blue'}"
                        data-val="${start}"
                    ></div>`
        }

        // Calculate the dimensions of each box i.e: (Total )
        const boxDim = (this.gameArena.clientWidth - (10 * this.m))/this.m
        
        this.gameArena.style.gridTemplateRows = `repeat(${this.m}, ${boxDim}px)`
        this.gameArena.style.gridTemplateColumns = `repeat(${this.n}, ${boxDim}px)`
        this.gameArena.innerHTML = boxEl;

        this.startGame()
    };

    /**
     * Displays the option modal.
     *
     */
    this.showOptions = function() {
        
        //  Show the options modal
        let messageModal = `<div class="modal-wrapper">
                            <span>${message}</span>
                        </div>`;

        let restartModal = `<div class=""></div>`

    };

    this.startCountdown = function() {

        clearTimeout(this.freezeTimeout)

        var countdown = 10
        this.counterListener = setInterval(() => {
            this.counterEl.innerText = countdown;
            countdown =countdown-1;
        }, 1000);

        this.gameCountDown = setTimeout(()=>{
            this.resetGame()
        }, this.maxTime)
    };

    this.resetGame = function(){
        // Clears the layout, Resets all counters.
        
        clearInterval(this.counterListener)
        clearTimeout(this.gameCountDown)
        this.counterListener = 0
    };

    this.startGame = function() {
        // Handles the game countdown.
        this.freezeTimeout = setTimeout(() => {
            // this.clearDashboard()
            this.startCountdown()
        }, 1000);
    };
    
    this.showModal = function(modal) {
        
        this.modalEl.innerHTML(modal)
    };

    this.registerEvents = function() {
        // Register all events here.
        let restartBtn = document.getElementById("restart-btn")
        restartBtn.addEventListener("click", () => this.resetGame())
    };
}

// Load the game
var GameInst = new GameEngine()
GameInst.init("medium")

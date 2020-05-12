/**
 * @author joeldsouza
 */

 var GameEngine = {
    init: function(difficulty) {
        // Initialize

        // Default
        this.getDifficulty(difficulty)
        this.m = 5;
        this.n = 5;
        this.minColoredSquare = 3;
        this.maxTime = 10;
        this.gameArena = document.getElementById("arena")
        this.modalEl = document.getElementById("options-modal")
        this.startGame()
    },
    getDifficulty : function(difficulty) {

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
    },
    renderGame : function() {
        // Render the changes to the dom.
        let el = document.getElementById("game-app")
        el.innerHTML = "Game renders here"

    },
    startGame: function() {
        // The brain of the game.
        this.totalSquares = this.m * this.n;
        this.coloredSquares = [];
        //Get random squares to be red.
        for(let start=0; start<=this.totalSquares; start++) {

            this.coloredSquares = [
                ...this.coloredSquares,
                Math.floor(Math.random() * (this.totalSquares/2 - this.minColoredSquare)) + this.minColoredSquare
            ];
        }

        this.renderLayout()
     },
     renderLayout: function() {
        // Render the game layout
        let boxEl = ''
        for(let start=0; start<=this.totalSquares; start++) {
            boxEl += `<div class="box ${this.coloredSquares.includes(start) ? 'red' : 'blue'}"></div>`
        }

        const boxDim = (this.gameArena.clientWidth - (10*(this.m-1)))/this.m
        
        this.gameArena.style.gridTemplateRows = `repeat(${this.m}, ${boxDim}px)`
        this.gameArena.style.gridTemplateColumns = `repeat(${this.n}, ${boxDim}px)`
        this.gameArena.innerHTML = boxEl;
     },
     showOptions: function() {
        //  Show the options modal
        let messageModal = `<div class="modal-wrapper">
                            <span>${message}</span>
                        </div>`;

        let restartModal = `<div class=""></div>`

     },
     clearGame: function(){
        // Clears the layout.
        this.gameArena.innerHTML="";
     },
     showModal: function(modal) {
        
        this.modalEl.innerHTML(modal)
     },
     registerEvents: function() {
        //  Register all the events
        document.addEventListener("click", renderOptions)
        document.addEventListener("click")
     } 
};

// Load the game
GameEngine.init("medium")
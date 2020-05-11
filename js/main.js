/**
 * @author joeldsouza
 */

 (function(){


     // Render the changes to the dom.
     var renderGame = function() {
         
     
     
         let el = document.getElementById("game-app")
         el.innerHTML = "Game reders here"
     }
     
     // Define GameEngine
     var gameEngine = function() {
     
     }
     
     
     var Game = new gameEngine(13)
     
     renderGame()
 }
 )()
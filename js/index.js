// Flat Snake
// Paul Krishnamurthy 2015
// www.PaulKr.com

$(document).ready(function(){

	// Setup
	var canvas = document.getElementById('canvas');
	canvas.width  = window.innerWidth-13;
	canvas.height = window.innerHeight-100;
	var ctx = canvas.getContext('2d');
	
	// Handle screens
	$("#death").hide();
	$("#game").hide();

	$("#info").submit(function(event){
		main();
		$("#start").fadeOut(500);
		$("#game").delay(300).fadeIn(1000);
		event.preventDefault();
	})

	// Play again
	$("#playAgain").click(function(){
		window.location.reload();
	})

	// Constants
	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;
	var SNAKE_COL = "#2ecc71";
	var FOOD_COL = "#2c3e50";
	var BACKGROUND = "#e85445";
	var SCOREDISPLAY = $("#score");
	var NAMEDISPLAY = $("#flatSnake");

	// Game
	var snakeCells = [];
	var last = {};
	var direction = "right";
	var food = {};
	var length = 4;
	var score = 0;
	
	var isAlive = true;

	// Targe x,y (futur positions)
	var tx = 0;
	var ty = 0;
	
	function main(){
		// Initial game setup

		// Initial score
		SCOREDISPLAY.text(score.toString());
		NAMEDISPLAY.text("Flat Snake: " + $("#name").val());


		// Add to snake cell array
		for (var i=length; i>=0; i--){
			// Create snake at top left of canvas
			snakeCells.push({
				x: i,
				y: 0
			})
		}

		// Create food dictionary
		food = {
			x: Math.floor(Math.random()*WIDTH/15),
			y: Math.floor(Math.random()*HEIGHT/15)
		}

		// Set game loop interval
		looped = setInterval(render, 100);
	}

	function addFood(){
		// Adds new food

		food = {
			x: Math.floor(Math.random()*WIDTH/15),
			y: Math.floor(Math.random()*HEIGHT/15)
		}
	}

	function move(){
		// Move snake based on direction

		if (direction == "right") {
			tx ++;
		} else if (direction == "left") {
			tx --;
		} else if (direction == "up") {
			ty --;
		} else if (direction == "down") {
			ty ++;
		}
	}

	function checkDeath(){
		// Check if player died

		// Check boundary
		if (tx<0 || ty<0 || tx>WIDTH/15 || ty>HEIGHT/15) {
			isAlive = false;
			return;
		}
		// Check for collision with self
		for (var i=0; i<snakeCells.length; i++){
			if (snakeCells[i].x == tx && snakeCells[i].y == ty){
				isAlive = false;
				return;
			}
		}
	}

	function death(){
		// Load death screen
		
		$("#death").fadeIn(1000);
		isAlive = false;
	}

	function checkFood(){
		// Check for collision

		// Snake collides with food
		if (food.x == tx && food.y == ty){
			// Create new food
			addFood();
			// Update score
			score ++;
			SCOREDISPLAY.text(score.toString());
			// Make last to current position
			last = {
				x: tx,
				y: ty
			}
		} else {
			// Remove last element from snakeCells
			last = snakeCells.pop();
			// Make last to current position
			last = {
				x: tx,
				y: ty
			}
		}

		// Add to beginning of snake
		snakeCells.unshift(last);
	}

	function render(){
		// Render scene

		// Draw background
		ctx.fillStyle = BACKGROUND;
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		if (isAlive){
			// Snake coordinates (target x,y)
			tx = snakeCells[0].x;
			ty = snakeCells[0].y;
			// Move snake
			move();
		} else {
			death();
		}

		// Check for boundary and collision death
		checkDeath();

		// Check food collision
		checkFood();

		// Set color
		ctx.fillStyle = SNAKE_COL
		for (var i=0; i<snakeCells.length; i++){
			// Draw rect on cell
			ctx.fillRect(snakeCells[i].x*15, snakeCells[i].y*15, 15, 15)
		}

		// Set color
		ctx.fillStyle = FOOD_COL;
		// Set color
		ctx.fillRect(food.x*15, food.y*15, 15, 15)
	}


	// Jquery keydown events
	$(document).keydown(function(event){

		var key = event.which;

		// Check ASCII characters (arrows and ASWD)
		// Snake cannot go in opposite direction
		if ((key == 37 || key == 65) && direction !== "right"){
			direction = "left";
		} else if ((key == 38 || key == 87) && direction !== "down"){
			direction = "up";
		} else if ((key == 39 || key == 68) && direction !== "left"){
			direction = "right";
		} else if ((key == 40 || key == 83) && direction !== "up"){
			direction = "down";
		}


	});

});
// game.js
// Paul Krishnamurthy

$(document).ready(function () {

	// Setup
	var canvas = document.getElementById("GameScreen");
	canvas.width  = 900;
	canvas.height = 500;
	var ctx = canvas.getContext("2d");

	$("#GameOver").hide();
	$("#PreGame").show();
	$("#GameScreen").hide();

	$("#PreGame").click(function () {
		$("#PreGame").hide();
		$("#GameScreen").show();
		init();
	})

	// Constants
	var WIDTH        = 900;
	var HEIGHT       = 500;
	var SNAKE_COL    = "#9B59B6";
	var FOOD_COL     = "#2C3E50";
	var BACKGROUND   = "#ECF0F1";
	var SCOREDISPLAY = $(".score");

	console.log(WIDTH, HEIGHT)

	// Game
	var snakeCells = [];
	var last       = {};
	var direction  = "right";
	var food       = {};
	var length     = 4;
	var score      = 0;
	var isAlive    = true;
	
	// Targe x,y (futur positions)
	var tx = 0;
	var ty = 0;

	/**
	 * Initial game setup
	 */
	function init () {

		// Initial score
		SCOREDISPLAY.text(score.toString());

		// Add to snake cell array
		for (var i = length; i >= 0; i--) {

			// Create snake at top left of canvas
			snakeCells.push({
				x: i,
				y: 0
			})
		}

		// Create food dictionary
		food = {
			x: Math.floor(Math.random() * WIDTH/15),
			y: Math.floor(Math.random() * HEIGHT/15)
		}

		// Set game loop interval
		looped = setInterval(render, 100);
	}

	/**
	 * Adds new food
	 */
	function addFood () {
		food = {
			x : Math.floor(Math.random() * WIDTH / 15),
			y : Math.floor(Math.random() * HEIGHT / 15)
		}
	}

	/**
	 * Move snake based on direction
	 */
	function move () {
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

	/**
	 * Checks if player has died
	 */
	function checkDeath () {

		// Check boundary
		if (tx < 0 || ty < 0 || tx > WIDTH/15 || ty > HEIGHT/15) {
			isAlive = false;
			return;
		}
		// Check for collision with self
		for (var i = 0; i < snakeCells.length; i++) {
			if (snakeCells[i].x == tx && snakeCells[i].y == ty){
				isAlive = false;
				return;
			}
		}
	}

	/**
	 * Snake death
	 */
	function death () {
		isAlive = false;
		$("#GameScreen").fadeOut(500);
		$("#GameOver").delay(500).fadeIn(500);

		$("#GameOver").click(function () {
			window.location.reload();
		})
	}

	/**
	 * Check for collision with food
	 */
	function checkFood () {

		// Snake collides with food
		if (food.x == tx && food.y == ty) {

			// Create new food
			addFood();

			// Update score
			score ++;
			SCOREDISPLAY.text(score.toString());

			// Set last to current position
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

	/**
	 * Renders game
	 */
	function render () {

		// Draw background
		ctx.fillStyle = BACKGROUND;
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		if (isAlive) {

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
		for (var i = 0; i < snakeCells.length; i++) {

			// Draw rect on cell
			ctx.fillRect(snakeCells[i].x * 15, snakeCells[i].y * 15, 15, 15)
		}

		// Set color
		ctx.fillStyle = FOOD_COL;

		// Set color
		ctx.fillRect(food.x * 15, food.y * 15, 15, 15)
	}


	$(document).keydown(function (e) {

		var key = e.which;

		// Check ASCII characters (arrows and ASWD)
		// Snake cannot go in opposite direction
		if ((key == 37 || key == 65) && direction !== "right") {
			direction = "left";
		} else if ((key == 38 || key == 87) && direction !== "down") {
			direction = "up";
		} else if ((key == 39 || key == 68) && direction !== "left") {
			direction = "right";
		} else if ((key == 40 || key == 83) && direction !== "up") {
			direction = "down";
		}

	});

})

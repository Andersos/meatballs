// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// fork image
var forkReady = false;
var forkImage = new Image();
forkImage.onload = function () {
	forkReady = true;
};
forkImage.src = "images/fork.png";

// meatball image
var meatballReady = false;
var meatballImage = new Image();
meatballImage.onload = function () {
	meatballReady = true;
};
meatballImage.src = "images/meatball.png";

// meatball infected image
var meatballInfectedReady = false;
var meatballInfectedImage = new Image();
meatballInfectedImage.onload = function () {
	meatballInfectedReady = true;
};
meatballInfectedImage.src = "images/meatball_green.png";

// Game objects
var fork = {
	speed: 256 // movement in pixels per second
};
var meatball = {
	speed: 128, // movement in pixels per second
	infected: false
};
var meatballsCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a meatball
var reset = function () {
	fork.x = canvas.width / 2;
	fork.y = canvas.height - 32;
};

// Update game objects
var update = function (modifier) {
	if (37 in keysDown) {
	// Player holding left
		fork.x -= fork.speed * modifier;
	}
	if (39 in keysDown) {
	// Player holding right
		fork.x += fork.speed * modifier;
	}

	if (fork.x < 0) {
		fork.x = canvas.height;
	}
	if (fork.x > canvas.height) {
		fork.x = 0;
	}

	if (meatball.y < canvas.height) {
		meatball.y += meatball.speed * modifier;
	} else{
		meatball.x = 32 + (Math.random() * (canvas.width - 64));
		meatball.y = 16;
	}

	// Scoring points
	if (
		fork.x <= (meatball.x + 32)
		&& meatball.x <= (fork.x + 32)
		&& fork.y <= (meatball.y + 32)
		&& meatball.y <= (fork.y + 32)
	) {
		if (meatball.infected) {
			meatballsCaught = 0;
		} else{
			++meatballsCaught;
		}

		// Make infected meatball 5% of the times
		if (Math.random() > 0.10) {
			meatball.infected = false;
		} else{
			meatball.infected = true;
		}
		// Throw the meatball somewhere on the screen randomly
		meatball.x = 32 + (Math.random() * (canvas.width - 64));
		meatball.y = 16 ;
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (forkReady) {
		ctx.drawImage(forkImage, fork.x, fork.y);
	}

	if (meatballReady && meatballInfectedReady) {
		if (meatball.infected) {
			ctx.drawImage(meatballInfectedImage, meatball.x, meatball.y);
		} else{
			ctx.drawImage(meatballImage, meatball.x, meatball.y);

		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Meatballs caught: " + meatballsCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

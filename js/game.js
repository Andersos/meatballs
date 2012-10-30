// Settings
var specialEventProbability = 0.50;

// Create the canvas
var canvas = document.createElement("canvas");
var specialEvent = false;
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

// fork infected image
var forkInfectedReady = false;
var forkInfectedImage = new Image();
forkInfectedImage.onload = function () {
	forkInfectedReady = true;
};
forkInfectedImage.src = "images/fork_green.png";

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

// meatball healer image
var meatballHealerReady = false;
var meatballHealerImage = new Image();
meatballHealerImage.onload = function () {
	meatballHealerReady = true;
};
meatballHealerImage.src = "images/meatball_red.png";

// Game objects
var fork = {
	speed: 256, // movement in pixels per second
	infected: false
};
var meatball = {
	speed: 512, // movement in pixels per second
	infected: false,
	healer: false
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
	render();
	// Player holding left
	if (37 in keysDown) {
		if (fork.infected) {
			fork.x += fork.speed * modifier;
		} else{
			fork.x -= fork.speed * modifier;
		}
	}
	// Player holding right
	if (39 in keysDown) {
		if (fork.infected) {
			fork.x -= fork.speed * modifier;
		} else{
			fork.x += fork.speed * modifier;
		}
		
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
		specialEvent = Math.random() > specialEventProbability;
		if(fork.infected){
			// Spawn red meatball
			if (specialEvent) {
				meatball.healer = false;
			} else{
				meatball.healer = true;
			}
		} else{
			if (specialEvent) {
				meatball.infected = false;
			} else{
				meatball.infected = true;
		}
		}
	}

	// Scoring points
	if (
		fork.x <= (meatball.x + 32)
		&& meatball.x <= (fork.x + 32)
		&& fork.y <= (meatball.y + 32)
		&& meatball.y <= (fork.y + 32)
	) {
		if (meatball.infected) {
			fork.infected = true;
			--meatballsCaught;
			meatball.infected = false;
		} else if (fork.infected){
			if (meatball.healer) {
				fork.infected = false;
				meatball.healer = false;
			} else{
				--meatballsCaught;
			}
		} else {
			++meatballsCaught;
		}

		// Make infected meatball 5% of the times
		specialEvent = Math.random() > specialEventProbability;
		if(fork.infected){
			// Spawn red meatball
			if (specialEvent) {
				meatball.healer = false;
			} else{
				meatball.healer = true;
			}
		} else{
			if (specialEvent) {
				meatball.infected = false;
			} else{
				meatball.infected = true;
		}
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

	if (forkReady && forkInfectedReady) {
		if (fork.infected) {
			ctx.drawImage(forkInfectedImage, fork.x, fork.y);
		} else{
			ctx.drawImage(forkImage, fork.x, fork.y);

		}
	}

	if (meatballReady && meatballInfectedReady && meatballHealerReady) {
		if (meatball.infected) {
			ctx.drawImage(meatballInfectedImage, meatball.x, meatball.y);
		} else if (meatball.healer) {
			ctx.drawImage(meatballHealerImage, meatball.x, meatball.y);
		} else {
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

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

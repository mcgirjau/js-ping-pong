let canvas;
let ctx;

let DIRECTION = {
  STOPPED: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT:4
}

class Paddle {

  constructor(side) {

    this.width = 15;
    this.height = 65;
    this.x = (side === 'left') ? 150 : canvas.width - 150;
    this.y = canvas.height / 2;
    this.score = 0;
    this.move = DIRECTION.STOPPED;
    this.speed = 11;
  }
}

class Ball {

  constructor(newSpeed) {

    this.width = 10;
    this.height = 10;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.moveX = DIRECTION.STOPPED;
    this.moveY = DIRECTION.STOPPED;
    this.speed = newSpeed;
  }
}

let player;
let computer;
let ball;
let running = false;
let gameOver = false;
let delayAmount;
let targetForBall;

document.addEventListener('DOMContentLoaded', SetupCanvas);

function SetupCanvas() {

  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = document.body.clientWidth - 30;
  canvas.height = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  ) - 50;
  player = new Paddle('left');
  computer = new Paddle('right');
  ball = new Ball(6);
  computer.speed = 5.5;
  targetForBall = player;
  delayAmount = (new Date()).getTime();
  document.addEventListener('keydown', MovePlayerPaddle);
  document.addEventListener('keyup', StopPlayerPaddle);
  Draw();
}

function Draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.width, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.font = '80px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(player.score.toString(), (canvas.width / 2) - 300, 100);
  ctx.fillText(computer.score.toString(), (canvas.width / 2) + 300, 100);

  if (player.score === 2) {
    ctx.fillText('You Win!', canvas.width / 2, 300);
    gameOver = true;
  }

  if (computer.score === 2) {
    ctx.fillText('You Lose!', canvas.width / 2, 300);
    gameOver = true;
  }
}

function Update() {

  if (!gameOver) {

    if (ball.x <= 0) {
      ResetBall(computer, player);
    } else if (ball.x >= canvas.width - ball.width) {
      ResetBall(player, computer);
    }

    if (ball.y <= 0) {
      ball.moveY = DIRECTION.DOWN;
    } else if (ball.y >= canvas.height - ball.height) {
      ball.moveY = DIRECTION.UP;
    }

    if (player.move === DIRECTION.DOWN) {
      player.y += player.speed;
    } else if (player.move === DIRECTION.UP) {
      player.y -= player.speed;
    }

    if (player.y < 0) {
      player.y = 0;
    } else if (player.y >= canvas.height - player.height) {
      player.y = canvas.height - player.height;
    }

    if (AddDelay() && targetForBall) {
      ball.moveX = (targetForBall === player) ? DIRECTION.LEFT : DIRECTION.RIGHT;
      ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
      ball.y = canvas.height / 2;
      targetForBall = null;
    }

    if (ball.moveY === DIRECTION.UP) {
      ball.y -= ball.speed;
    } else if (ball.moveY === DIRECTION.DOWN) {
      ball.y += ball.speed;
    }

    if (ball.moveX === DIRECTION.LEFT) {
      ball.x -= ball.speed;
    } else if (ball.moveX === DIRECTION.RIGHT) {
      ball.x += ball.speed;
    }

    if (computer.y > ball.y - (computer.height / 2)) {
      if (ball.moveX === DIRECTION.RIGHT) {
        computer.y -= computer.speed;
      }
    }

    if (computer.y < ball.y - (computer.height / 2)) {
      if (ball.moveX === DIRECTION.RIGHT) {
        computer.y += computer.speed;
      }
    }

    if (computer.y < 0) {
      computer.y = 0;
    } else if (computer.y >= canvas.height - computer.height) {
      computer.y = canvas.height - computer.height;
    }

    if (ball.x - ball.width <= player.x && ball.x >= player.x - player.width) {
      if (ball.y <= player.y + player.height && ball.y + ball.height >= player.y) {
        ball.moveX = DIRECTION.RIGHT;
      }
    }

    if (ball.x - ball.width <= computer.x && ball.x >= computer.x - computer.width) {
      if (ball.y <= computer.y + computer.height && ball.y + ball.height >= computer.y) {
        ball.moveX = DIRECTION.LEFT;
      }
    }
  }
}

function MovePlayerPaddle(key) {

  if (!running) {
    running = true;
    window.requestAnimationFrame(GameLoop);
  }

  if (key.keyCode === 38 || key.keyCode === 87) {
    player.move = DIRECTION.UP;
  } else if (key.keyCode === 40 || key.keyCode === 83) {
    player.move = DIRECTION.DOWN;
  }
}

function StopPlayerPaddle(event) {
  player.move = DIRECTION.STOPPED;
}

function ResetBall(winner, loser) {

  ++winner.score;
  let newBallSpeed = ball.speed + 0.2;
  ball = new Ball(newBallSpeed);
  targetForBall = loser;
  delayAmount = (new Date()).getTime();
}

function AddDelay() {
  return((new Date()).getTime() - delayAmount >= 1000);
}

function GameLoop() {
  Update();
  Draw();
  if (!gameOver) {
    requestAnimationFrame(GameLoop);
  }
}
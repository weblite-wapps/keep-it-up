max_speed = 8.5;
jump = 16;
gravity = 0.17;
ball_scale = 0.068;
touch_sensevity_radius = 1.7;

window.onload = function() {
  canvas = document.getElementById("canvas_container");
  w_h = canvas.height = window.innerHeight - 32;
  w_w = canvas.width = window.innerWidth;
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FF0000";
  game = new Game();
  gameloop = setInterval(() => {
    game.update();
  }, 18);
};

function saveRecord() {
  var name = userName;
  if (name) {
    var record_date = formatDate(new Date());
    writeScoreData(name, record_date, game.score);
  }
}

function writeScoreData(name, date, score) {
  database
    .ref("scores/" + name)
    .once("value")
    .then(function(snapshot) {
      if (snapshot.val()) {
        if (game.score > snapshot.val().score) {
          write_score();
        }
      } else {
        write_score();
      }
    });

  function write_score() {
    database.ref("scores/" + name).set({
      name: name,
      date: date,
      score: score
    });
  }
}

function presentSubmitter() {
  game.draw_background();
  ctx.font = "30px monospace";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(
    `Score : ${game.score} ${game.score < 0 ? ":))" : ""}`,
    w_w / 2,
    w_h / 6
  );
  ctx.font = "30px monospace";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", w_w / 2, w_h / 2);
  saveRecord();
}

function Game() {
  this.game_over = false;
  this.score = 0;
  this.is_started = false;
  this.ball = new Ball();
  this.ball.decrease_score = () => {
    this.score--;
  };
  this.ball.increase_score = () => {
    this.score++;
  };
  this.update = () => {
    ctx.clearRect(0, 0, w_w, w_h);
    this.draw_background();
    if (!this.is_started) {
      ctx.font = "30px monospace";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(`tap to start`, w_w / 2, w_h / 6);
      this.ball.draw();
    } else {
      ctx.font = "30px monospace";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText(
        `Score : ${this.score} ${this.score < 0 ? ":))" : ""}`,
        w_w / 2,
        w_h / 6
      );
      if (this.game_over) {
        clearInterval(gameloop);
        presentSubmitter();
      } else {
        this.game_over = this.ball.losed();
        this.ball.update();
      }
    }
  };
  this.draw_background = () => {
    var image = new Image();
    image.src = "img/field.png";
    ctx.drawImage(image, 100, 0, 430, 480, 0, 0, w_w, w_h);
  };

  this.clicked = () => {
    this.is_started = true;
    canvas.addEventListener("mousedown", this.ball.clicked);
  };
  canvas.addEventListener("mousedown", this.clicked);
}

function Ball() {
  this.x = w_w / 2;
  this.y = w_h / 3;
  this.r = w_w * ball_scale;
  this.sensetivity = this.r * touch_sensevity_radius;
  this.Vx = 0;
  this.Vy = -6;
  this.gravity = gravity;
  this.update = () => {
    if (this.Vy < -max_speed) {
      this.Vy = -max_speed;
    }

    this.x = this.x + this.Vx;
    if (this.x + this.r > w_w) {
      //   this.x = w_w - 2 * ((this.x + this.r) - w_w);
      this.Vx *= -1;
      this.decrease_score();
    }
    if (this.x - this.r < 0) {
      this.decrease_score();
      this.Vx *= -1;
    }
    this.Vy = this.gravity + this.Vy;
    this.y = this.y + this.Vy;
    this.draw();
  };
  this.draw = () => {
    var image = new Image();
    image.src = "img/soccer-ball.png";
    ctx.drawImage(
      image,
      this.x - this.r,
      this.y - this.r,
      2 * this.r,
      2 * this.r
    );
  };
  this.clicked = event => {
    var { x, y } = canvas_position(event);
    if (distance(x, y, this.x, this.y) < this.sensetivity && this.y < y) {
      this.Vy -= jump;
      var x_percent = (this.x - x) / this.sensetivity;
      this.Vx = x_percent * 7;
      this.increase_score();
      // check for hit
      //update Vx Vy and score
    }
  };
  this.losed = () => {
    if (this.y > w_h + this.r) {
      return true;
    }
    return false;
  };
}

function canvas_position(event) {
  var x;
  var y;
  if (event.pageX || event.pageY) {
    x = event.pageX;
    y = event.pageY;
  } else {
    x =
      event.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    y =
      event.clientY +
      document.body.scrollTop +
      document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  return { x, y };
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function formatDate(date) {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + " " + monthNames[monthIndex] + " " + year;
}

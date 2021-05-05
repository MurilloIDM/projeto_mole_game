const $levels = {
  "easy": 3,
  "medium": 5,
  "hard": 7
};


const $imagesGame = {
  "active": "toupeira.gif",
  "dead": "morreu.gif",
  "default": "buraco.gif"
};

let $imageWidth = 80; // Largura da toupeira
let $imageHeight = 60; // Altura da toupeira

const $initialTime = 30;

let $selectLevel = "easy";

let $idChronoGame;
let $idStartGame;
let $value = 0;
let $timeGame = $initialTime;

$(document).ready(function() {

  sizeScreenAction();

  $(window).resize(function() {
    sizeScreenAction();
 	});

  $("#chrono").text($initialTime.toLocaleString("pt-br", {minimumIntegerDigits: 2}));

  $(".btn_levels").click(function() {
    $selectLevel = $(this).val();

    $(".levels").fadeOut(600);
    fillBoard();
  });

  $("#btnPlay").click(function() {
    buttonControl(1);
    $idStartGame = setInterval(startGame, 1180); //1180
    $idChronoGame = setInterval(startChronoGame, 1000);
  });

  $("#btnLevel").click(function() {
    $(".levels").fadeToggle(600).css("display", "flex");
  });

  $("#btnCloseModal").click(function() {
    $(".levels").fadeToggle(600).css("display", "flex");
  });

  $("#btnPause").click(function() {
    buttonControl(2);
    resetGame("intervals");
    resetMoleMarked();
  });

  $("#btnStop").click(function() {
    buttonControl(3);
    resetGame("all");
    resetMoleMarked();
  });

  $("#btnExit").click(function() {
    alertWifi("Você já está indo embora?", false, 0, false, 24, false);
  });
});

function fillBoard() {
  const $level = getLevel();

  const $boardWith = $imageWidth * $level;
  const $boardHeight = $imageHeight * $level;

  $("#board").css({ width: $boardWith, height: $boardHeight });

  placeHolesBoard($level);
}

function placeHolesBoard($level) {

  $("#board").empty();

  for ($x = 0; $x < Math.pow($level, 2); $x++) {
    const $div = $("<div></div>");
    const $img = $("<img>").attr({ src: `img/${$imagesGame.default}`, id: `mole_${$x + 1}` });

    $($img).click(function() {
      updateScore(this);
    });
  
    $($div).append($img);
    $("#board").append($div);
  }
}

function startGame() {
  resetMoleMarked();

  const $level = getLevel();
  const $randNumber = getRandNumber(1, Math.pow($level, 2));

  const $id = `#mole_${$randNumber}`;

  $($id).attr("src", `img/${$imagesGame.active}`);
  $($id).addClass("marked");
}

function getRandNumber(min, max) {
  return Math.round((Math.random() * Math.abs(max - min)) + min);
}

function getLevel() {
  return $levels[$selectLevel];
}

function updateScore($image) {
  if ($($image).attr("src").includes($imagesGame.active)) {
    $("#score").text($value += 1);
    $($image).attr("src", `img/${$imagesGame.dead}`);
  }
}

function buttonControl(button) {
  switch(button) {
    case 1:
      $("#btnPlay").prop("disabled", true);
      $("#btnStop").prop("disabled", false);
      $("#btnExit").prop("disabled", true);
      $("#btnLevel").prop("disabled", true);
      $("#btnPause").prop("disabled", false);
      break;
    case 2:
      $("#btnPlay").prop("disabled", false);
      $("#btnStop").prop("disabled", false);
      $("#btnExit").prop("disabled", false);
      $("#btnLevel").prop("disabled", true);
      $("#btnPause").prop("disabled", true);
      break;
    case 3:
      $("#btnPlay").prop("disabled", false);
      $("#btnStop").prop("disabled", true);
      $("#btnExit").prop("disabled", false);
      $("#btnLevel").prop("disabled", false);
      $("#btnPause").prop("disabled", true);
      break;
    default:
      break;
  }
}

function startChronoGame() {
  ($timeGame > 0)
    ? $("#chrono").text((--$timeGame).toLocaleString("pt-br", {minimumIntegerDigits: 2}))
    : endGame();
}

function resetMoleMarked() {
  const $id = `#${$(".marked").attr("id")}`;

  if ($id) {
    $($id)
      .removeClass("marked")
      .attr("src", `img/${$imagesGame.default}`);
  }
}

function resetGame(option) {
  if (option === "all") {
    $value = 0;
    $timeGame = $initialTime;

    $("#score").text($value);
    $("#chrono").text($initialTime.toLocaleString("pt-br", {minimumIntegerDigits: 2}));
  }
  
  clearInterval($idChronoGame);
  clearInterval($idStartGame);
}

function endGame() {
  const $finishValue = $value;

  resetGame("all");
  buttonControl(3);

  fillBoard();
  alertWifi(`Fim de jogo. Sua pontuação foi igual ${$finishValue}`, false, 0, `img/${$imagesGame.dead}`, 24, true);
}

function sizeScreenAction() {
  let $width = $(window).width();

  $imageWidth = 80;
  $imageHeight = 60;

  if ($width <= 767) {
    $imageWidth = 50;
    $imageHeight = 40;
  }

  fillBoard();
}
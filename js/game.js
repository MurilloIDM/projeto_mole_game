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

	$(window).resize(function() {
		let $width = $(window).width();

		$imageWidth = 80;
		$imageHeight = 60;

		if ($width <= 592) {
			$imageWidth = 50;
			$imageHeight = 40;
		}

		fillBoard();
		return;
 	});

	 fillBoard();

  $("#chrono").text($initialTime.toLocaleString("pt-br", {minimumIntegerDigits: 2}));

  $(".btn_levels").click(function() {
    $selectLevel = $(this).val();

    $(".levels").fadeOut(600);
    fillBoard();
  });

  $("#btnPlay").click(function() {
    btnCtrl();
    $idStartGame = setInterval(startGame, 1180);
    $idChronoGame = setInterval(startChronoGame, 1000);
  });

  $("#btnLevel").click(function() {
    $(".levels").fadeToggle(600).css("display", "grid");
  });

  $("#btnPause").click(function() {
  });

  $("#btnStop").click(function() {
    
  });

  $("#btnExit").click(function() {
    alertWifi("Você já está indo embora?", false, 0, false, 24, false);
  });
});

function fillBoard() {
  const $level = getLevel();

  console.log($level);

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
  fillBoard();

  const $level = getLevel();
  const $randNumber = getRandNumber(1, Math.pow($level, 2));

  $(`#mole_${$randNumber}`).attr("src", `img/${$imagesGame.active}`);
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

function btnCtrl() {
  $("#btnPause").prop("disabled", false);
  $("#btnStop").prop("disabled", false);
  $("#btnPlay").prop("disabled", true);
}

function startChronoGame() {
  ($timeGame > 0)
    ? $("#chrono").text((--$timeGame).toLocaleString("pt-br", {minimumIntegerDigits: 2}))
    : endGame();
}

function endGame() {
  clearInterval($idChronoGame);
  clearInterval($idStartGame);
  alertWifi(`Fim de jogo. Sua pontuação foi igual ${$value}`, false, 0, `img/${$imagesGame.dead}`, 24, true);
  fillBoard();

  $("#score").text("0");
  $("#chrono").text($initialTime.toLocaleString("pt-br", {minimumIntegerDigits: 2}));
}
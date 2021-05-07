const $URL = "http://192.168.100.55:8080";

const $levels = {
  "easy": 3,
  "medium": 5,
  "hard": 7
};

const $levelsView = {
  3: "easy",
  5: "medium",
  7: "hard"
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

  if (typeof Storage !== "undefined") {
    const $user = JSON.parse(localStorage.getItem("user"));

    if ($user) {
      const $level = $levelsView[getLevel()];

      const $payloadRank = {
        level: $level,
        idUser: $user.id,
        score: $finishValue,
      };

      console.log("payload -> ", $payloadRank);

      $.ajax({
        type: "POST",
        async: true,
        dataType: "json",
        url: `${$URL}/rank`,
        contentType: "application/json",
        data: JSON.stringify($payloadRank),
        success: function() {
          getRanks($finishValue);
        },
        error: function(data) {
          const { responseText } = data;
          const $errorText = responseText;

          getRanks($finishValue, $errorText);
        }
      });

    }

  } else {
    createMessage('Erro na validação, tente novamente!', "error", "error.png");
    return;
  }
}

function getRanks($score, $errorText) {
  const $level = $levelsView[getLevel()];

  const $message = $errorText ? $errorText : `Você ultrapassou sua record. Sua pontuação foi de ${$score}`;

  $.ajax({
    type: "GET",
    async: true,
    url: `${$URL}/rank?level=${$level}`,
    dataType: "json",
    success: function(data) {
      console.log("data ranks -> ", data);
      const $table = createTable(data);
      alertWifi($message, false, 0, `img/${$imagesGame.dead}`, 18, true, true, $table);
    },
  });
}

function createTable(ranks) {
  $table = $("<table></table>");
  $header = $("<tr></tr>").html("<th>Posição</th><th>Usuário</th><th>Pontuação</th><th>Nível</th>");

  $($table).append($header);

  ranks.forEach((rank, index) => {
    const $user = rank && rank.user.name;
    const $score = rank && rank.score;
    const $level = rank && rank.level;

    const $line = $("<tr></tr>");
    const $columnIndex = $("<td></td>").text(index + 1);
    const $columnUser = $("<td></td>").text($user);
    const $columnScore = $("<td></td>").text($score);
    const $columnLevel = $("<td></td>").text($level);

    $($line).append($columnIndex);
    $($line).append($columnUser);
    $($line).append($columnScore);
    $($line).append($columnLevel);

    $($table).append($line);
  });

  return $table;
}
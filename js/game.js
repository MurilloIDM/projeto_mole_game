const $initialTime = 30;

let $imageWidth = 80;
let $imageHeight = 60;

let $value = 0;
let $selectLevel = "easy";
let $timeGame = $initialTime;
let bleep = new Audio();
bleep.src = "/sound/click_sound.mp3";

let $idTimeGame;
let $idStartGame;
let $idUserGame;

$(document).ready(function() {
  sizeScreenAction();

  $(window).resize(function() {
    sizeScreenAction();
 	});

  $("#time").text(
    $initialTime.toLocaleString("pt-br", {minimumIntegerDigits: 2})
  );

  $(".btn_levels").click(function() {
    $selectLevel = $(this).val();

    $(".levels").fadeOut(600);
    fillBoard();
  });

  // Definição das ações dos botões
  $("#btnPlay").click(function() {
    buttonControl(1);
    $idStartGame = setInterval(startGame, 1180);
    $idTimeGame = setInterval(startTimeGame, 1000);
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
    alertWifi(["Você já está indo embora?"], false, 0, `img/${$IMAGES_GAME.default}`, 20, false, false, false, "Mole Game");
  });
});

// Funções do Motor do Jogo

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
    const $img = $("<img>").attr({ src: `img/${$IMAGES_GAME.default}`, id: `mole_${$x + 1}` });

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

  $($id).attr("src", `img/${$IMAGES_GAME.active}`);
  $($id).addClass("marked");
}

function updateScore($image) {
  if ($($image).attr("src").includes($IMAGES_GAME.active)) {
    bleep.play();
    $("#score").text($value += 1);
    $($image).attr("src", `img/${$IMAGES_GAME.dead}`);
  }
}

function endGame() {
  const $finishValue = $value;

  resetGame("all");
  buttonControl(3);
  fillBoard();

  if (typeof Storage !== "undefined") {
    const $user = JSON.parse(localStorage.getItem("user"));
    $idUserGame = $user.id;

    if ($user) {
      const $level = $LEVELS_NUMBER[getLevel()];

      const $payloadRank = {
        level: $level,
        idUser: $user.id,
        score: $finishValue,
      };

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

function limitFive($data) {
  const $array = [];
  const $length = $data.length;

  if ($length > 5) {
    for (let x = 0; x < 5; x++) {
      $array.push($data[x]);
    }

    return $array;
  }

  return $data;
}

function getRanks($score, $errorText) {
  const $level = $LEVELS_NUMBER[getLevel()];

  const $message = $errorText ?
    [`Você marcou ${$score} pontos!`, $errorText]
    : [`Você superou seu record anterior! Chegou em ${$score} pontos!`];

  $.ajax({
    type: "GET",
    async: true,
    url: `${$URL}/rank?level=${$level}`,
    dataType: "json",
    success: function(data) {
      const $ranks = limitFive(data);
      const $table = createTable($ranks);

      alertWifi($message, false, 0, `img/${$IMAGES_GAME.active}`, 18, true, true, $table, "Rank - Mole Game");
    },
  });
}

// Funções de Configuração

function getRandNumber(min, max) {
  return Math.round((Math.random() * Math.abs(max - min)) + min);
}

function getLevel() {
  return $LEVELS_STRING[$selectLevel];
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

function startTimeGame() {
  ($timeGame > 0)
    ? $("#time").text((--$timeGame).toLocaleString("pt-br", {minimumIntegerDigits: 2}))
    : endGame();
}

function resetMoleMarked() {
  const $id = `#${$(".marked").attr("id")}`;

  if ($id) {
    $($id)
      .removeClass("marked")
      .attr("src", `img/${$IMAGES_GAME.default}`);
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
    $("#time").text($initialTime.toLocaleString("pt-br", {minimumIntegerDigits: 2}));
  }
  
  clearInterval($idTimeGame);
  clearInterval($idStartGame);
}

function createTable(ranks) {
  $table = $("<table></table>");
  $header = $("<tr></tr>").html("<th>Posição</th><th>Usuário</th><th>Pontuação</th><th>Nível</th>");

  $($table).append($header);

  ranks.forEach((rank, index) => {
    const $id = rank && rank.user.id;
    const $user = rank && rank.user.name;
    const $score = rank && rank.score;
    const $level = rank && rank.level;

    const $line = $("<tr></tr>");

    if ($id === $idUserGame) {
      $($line).addClass("user_game");
    }

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
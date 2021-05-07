$(document).ready(function() {
  $("#btnRegister").click(function() {
    $username = $("#user").val();
    $password = $("#pwd").val();

    if ($username && $password) {
      const $userCreate = {
        name: $username,
        password: $password
      }

      $.ajax({
        type: "POST",
        async: true,
        url: `${$URL}/users`,
        contentType: "application/json",
        data: JSON.stringify($userCreate),
        dataType: "json",
        success: success,
        error: error,
      });

      $("#form_register").each(function() { 
        this.reset();
      });

      return;
    }

    createMessage("Preencha corretamente todos os campos!", "error", "error.png");
    return;
  });

  $("#view_password").click(function() {
    if ($(this).hasClass("visible")) {
      $(this).removeClass();
      $(this).addClass("invisible");
      $(this).attr("src", "img/invisible.svg");
      $("#pwd").attr("type", "password");
      return;
    }

    $(this).removeClass();
    $(this).addClass("visible");
    $(this).attr("src", "img/password.svg");
    $("#pwd").attr("type", "text");
  });

  $("#page_login").click(function() {
    open("index.html", "_self");
  });
});

function success() {
  const $messageSuccess = "Usuário cadastrado com sucesso! Bom jogo!";

  createMessage($messageSuccess, "success", "success.png");
}

function error(data) {
  const $messageError = `Oops...${data.responseText}`;

  createMessage($messageError, "error", "error.png");
}
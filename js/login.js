$(document).ready(function() {
  $("#btnLogin").click(function() {
    let $name = $("#user").val();
    let $pwd = $("#pwd").val();

    if ($name && $pwd) {
      $.ajax({
        type: "GET",
        async: true,
        url: `${$URL}/users/login?name=${$name}&password=${$pwd}`,
        dataType: "json",
        success: success
      });
    } else {
      createMessage("Informe o usuário e senha!", "error", "error.png");
      return;
    }
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

  $("#form_login").each(function() { 
    this.reset();
  });

  $("#page_register").click(function() {
    open("register.html", "_self");
  });
});

function success(data) {
  const { login, name, id } = data;

  if (login) {
    if (typeof (Storage) !== "undefined") {
      const user = {
        id,
        name
      };

      localStorage.setItem("user", JSON.stringify(user));

    } else {
      createMessage('Erro na validação, tente novamente!', "error", "error.png");
      return;
    }

    createMessage(`Boa sorte, ${name}. Aproveite o jogo!`, "success", "success.png");

    setTimeout(open, 1900, "game.html", "_self");
    return;
  }

  createMessage("Usuário não encontrado!", "error", "error.png");
  return;
}

function createMessage(message, className, icon) {
  $("#message")
    .html(
      `<span class="image_message"><img src='./img/${icon}' width='20' height='20' /></span>
      <span class="text_message">${message}</span>`
    );

  $("#message").removeClass();
  $("#message").addClass(className);
  $("#message").slideDown();

  $("#message").css("display", "flex");

  setTimeout(setHiddenMessage, 1800, "#message");
}

function setHiddenMessage($element) {
  $($element).slideUp();
}
function createMessage(message, className, icon) {
  $("#message").empty();

  const $spanImage = $("<span></span>").addClass("image_message");
  const $text = $("<span></span>").addClass("text_message");

  $($spanImage).html(`<img src='./img/${icon}' width='20' height='20' />`);
  $($text).text(message)

  $("#message").append($spanImage);
  $("#message").append($text);

  $("#message").removeClass();
  $("#message").addClass(className);
  $("#message").slideDown();

  $("#message").css("display", "flex");

  setTimeout(setHiddenMessage, 1800, "#message");
}

function setHiddenMessage($element) {
  $($element).slideUp();
}
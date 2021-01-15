$(document).ready(function() {
  $("#alreadyRegister").click(function() {
    $("#register").addClass("hide");
    $("#login").removeClass("hide");
  });
  $("#createAccount").click(function() {
    $("#login").addClass("hide");
    $("#register").removeClass("hide");
  });

  $("#registerName").focus(function() {
    $("#registerName").removeClass("input-invalid");
    $("#underFullNameRegister").addClass("hide");
  });

  $("#registerEmail").focus(function() {
    $("#registerEmail").removeClass("input-invalid");
    $("#underEmailRegister").addClass("hide");
  });

  $("#registerPassword").focus(function() {
    $("#registerPassword").removeClass("input-invalid");
    $("#underPasswordRegister").addClass("hide");
  });

  $("#loginEmail").focus(function() {
    $("#loginEmail").removeClass("input-invalid");
    $("#underEmailLogin").addClass("hide");
  });

  $("#loginPassword").focus(function() {
    $("#loginPassword").removeClass("input-invalid");
    $("#underPasswordLogin").addClass("hide");
  });

  $("#registerButton").click(function() {
    var inputIsOk = true;
    if ($("#registerName").val().length < 3) {
      inputIsOk = false;
      $("#registerName").addClass("input-invalid");
      $("#underFullNameRegister").removeClass("hide");
      $("#underFullNameRegister").addClass("text-invalid");
      $("#underFullNameRegister").text("Your name should be at least 3 characters.");
    }

    if ($("#registerEmail").val().length < 3) {
      inputIsOk = false;
      $("#registerEmail").addClass("input-invalid");
      $("#underEmailRegister").removeClass("hide");
      $("#underEmailRegister").addClass("text-invalid");
      $("#underEmailRegister").text("Your email is not valid.");
    }

    if ($("#registerPassword").val().length < 8) {
      inputIsOk = false;
      $("#registerPassword").addClass("input-invalid");
      $("#underPasswordRegister").removeClass("hide");
      $("#underPasswordRegister").addClass("text-invalid");
      $("#underPasswordRegister").text("The password should contain at least 8 characters.");
    }

    if (inputIsOk) {
      $.post("https://yosemite-fs.azurewebsites.net/register", {name: $("#registerName").val(), username: $("#registerEmail").val(), password: $("#registerPassword").val()}, function(response) {
        if (response.result == "redirect") {
          window.location.replace(response.url);
        }
      });
    }
  });

  $("#loginButton").click(function() {
    $.post("https://yosemite-fs.azurewebsites.net/login", {username: $("#loginEmail").val(), password: $("#loginPassword").val()}, function(response) {
      if (response.result == "redirect") {
        window.location.replace(response.url);
      }
    });
  });
});

$(document).ready(function() {
  $("#alreadyRegister").click(function() {
    $("#register").addClass("hide");
    $("#login").removeClass("hide");
  });
  $("#createAccount").click(function() {
    $("#login").addClass("hide");
    $("#register").removeClass("hide");
  });
});

$(document).ready(function() {
  $(".delete").click(function() {
    $.post("http://localhost:3000/delete", {filename: $(this).attr("alt")}, function(response) {
      if (response.result == "redirect") {
        window.location.replace(response.url);
      }
    });
  });
});

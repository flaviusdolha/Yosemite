$("#logoutButton").click(function() {
  $.get("http://localhost:3000/logout", function(response) {
    if (response.result == "redirect") {
      window.location.replace(response.url);
    }
  });
});

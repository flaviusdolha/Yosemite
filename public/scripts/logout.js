$("#logoutButton").click(function() {
  $.get("https://yosemite-fd.herokuapp.com/logout", function(response) {
    if (response.result == "redirect") {
      window.location.replace(response.url);
    }
  });
});

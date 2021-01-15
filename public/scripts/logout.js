$("#logoutButton").click(function() {
  $.get("https://yosemite-fs.azurewebsites.net/logout", function(response) {
    if (response.result == "redirect") {
      window.location.replace(response.url);
    }
  });
});

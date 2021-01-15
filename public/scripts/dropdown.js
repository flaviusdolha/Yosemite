$(document).ready(function() {

  $(".delete").click(function() {
    $.post("https://yosemite-fs.azurewebsites.net/delete", {filename: $(this).attr("alt")}, function(response) {
      if (response.result == "redirect") {
        window.location.replace(response.url);
    }
    });
  });

  $(".download").click(function() {
    fetch('https://yosemite-fs.azurewebsites.net/download?filename=' + $(this).attr("alt"))
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = $(this).attr("alt");
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => alert('oh no!'));
  });

  $(".share").click(function() {
    console.log($(this).attr("alt"));
    $.post("https://yosemite-fs.azurewebsites.net/share", {filename: $(this).attr("alt")}, function(response) {
      $("#share-link").attr("value", response.url);
    });
  });
});

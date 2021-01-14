$(document).ready(function() {

  $(".delete").click(function() {
    $.post("https://yosemite-fd.herokuapp.com/delete", {filename: $(this).attr("alt")}, function(response) {
      if (response.result == "redirect") {
        window.location.replace(response.url);
    }
    });
  });

  $(".download").click(function() {
    fetch('https://yosemite-fd.herokuapp.com/download?filename=' + $(this).attr("alt"))
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
    $.post("https://yosemite-fd.herokuapp.com/share", {filename: $(this).attr("alt")}, function(response) {
      $("#share-link").attr("value", response.url);
    });
  });
});

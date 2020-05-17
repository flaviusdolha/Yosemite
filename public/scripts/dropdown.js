$(document).ready(function() {
  $(".delete").click(function() {
    $.post("http://localhost:3000/delete", {filename: $(this).attr("alt")}, function(response) {
      if (response.result == "redirect") {
        window.location.replace(response.url);
      }
    });
  });

  $(".download").click(function() {
    fetch('http://localhost:3000/download?filename=' + $(this).attr("alt"))
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
});

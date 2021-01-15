$("#uploadInput").on("change", function() {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  $("#uploadButton").addClass("disabled");
  $("#up-icon").attr("hidden", true);
  $("#up-spinner").removeClass("hide");

  formData.append("file", $("#uploadInput")[0].files[0]);

  xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload();
        }
  };

  xhr.open("post", "https://yosemite-fs.azurewebsites.net/upload");
  xhr.send(formData);
});

$("#uploadInput").on("change", function() {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();

  formData.append("file", $("#uploadInput")[0].files[0]);
  console.log(formData.getAll("file"));

  xhr.open("post", "http://localhost:3000/upload");
  xhr.send(formData);
});

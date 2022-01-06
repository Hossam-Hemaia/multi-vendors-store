const file = document.querySelector("#DAD_file");
file.addEventListener("change", (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector(".DAD_file-name").textContent = fileNameAndSize;
});

const file1 = document.querySelector("#DAD_file1");
file1.addEventListener("change", (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector(".DAD_file-name1").textContent = fileNameAndSize;
});

const file2 = document.querySelector("#DAD_file2");
file2.addEventListener("change", (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector(".DAD_file-name2").textContent = fileNameAndSize;
});

const file3 = document.querySelector("#DAD_file3");
file3.addEventListener("change", (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector(".DAD_file-name3").textContent = fileNameAndSize;
});

const file4 = document.querySelector("#DAD_file4");
file4.addEventListener("change", (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector(".DAD_file-name4").textContent = fileNameAndSize;
});
const colorSet = document.getElementById("colorset");
const addColorBtn = document.getElementById("addColor");

addColorBtn.addEventListener("click", () => {
  let newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "colors";
  newInput.placeholder = "ادخل اسم اللون";
  colorSet.append(newInput);
});

const sizeSet = document.getElementById("sizeset");
const addSizeBtn = document.getElementById("addSize");

addSizeBtn.addEventListener("click", () => {
  let newInput = document.createElement("input");
  newInput.type = "text";
  newInput.name = "sizes";
  newInput.placeholder = "ادخل المقاس";
  sizeSet.append(newInput);
});

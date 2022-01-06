const checkbox = document.getElementById("checkStat");

checkbox.addEventListener("change", () => {
  if (checkbox.value === "off") {
    checkbox.checked = true;
    checkbox.value = "on";
  } else if (checkbox.value === "on") {
    checkbox.checked = false;
    checkbox.value = "off";
  }
});

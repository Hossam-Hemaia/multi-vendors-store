const showAddCategoryBtn = document.getElementById("catAdd");
const showModCategoryBtn = document.getElementById("catMod");
const categoryAddInput = document.getElementById("catNameAdd");
const catEnAddInput = document.getElementById("catEnAdd");
const catAddBtn = document.getElementById("addCat");
const categorySelect = document.getElementById("ctgrs");
const categoryModInput = document.getElementById("catNameMod");
const catEnModInput = document.getElementById("catEnMod");
const catModBtn = document.getElementById("modCat");
const lblArAdd = document.getElementById("lblArAdd");
const lblEnAdd = document.getElementById("lblEnAdd");
const lblSel = document.getElementById("lblSel");
const lblArMod = document.getElementById("lblArMod");
const lblEnMod = document.getElementById("lblEnMod");

categoryAddInput.style.display = "none";
catEnAddInput.style.display = "none";
catAddBtn.style.display = "none";
categorySelect.style.display = "none";
categoryModInput.style.display = "none";
catEnModInput.style.display = "none";
catModBtn.style.display = "none";
lblSel.style.display = "none";
lblArMod.style.display = "none";
lblEnMod.style.display = "none";
lblArAdd.style.display = "none";
lblEnAdd.style.display = "none";

if (showAddCategoryBtn) {
  showAddCategoryBtn.addEventListener("click", () => {
    lblArAdd.style.display = "block";
    lblEnAdd.style.display = "block";
    categoryAddInput.style.display = "block";
    catEnAddInput.style.display = "block";
    catAddBtn.style.display = "flex";
    if (categorySelect || categoryModInput || catEnModInput) {
      lblSel.style.display = "none";
      lblArMod.style.display = "none";
      lblEnMod.style.display = "none";
      categorySelect.style.display = "none";
      categoryModInput.style.display = "none";
      catEnModInput.style.display = "none";
      catModBtn.style.display = "none";
    }
  });
}

if (showModCategoryBtn) {
  showModCategoryBtn.addEventListener("click", () => {
    lblSel.style.display = "block";
    lblArMod.style.display = "block";
    lblEnMod.style.display = "block";
    categorySelect.style.display = "block";
    categoryModInput.style.display = "block";
    catEnModInput.style.display = "block";
    catModBtn.style.display = "flex";
    if (categoryAddInput || catEnAddInput || catAddBtn) {
      lblArAdd.style.display = "none";
      lblEnAdd.style.display = "none";
      categoryAddInput.style.display = "none";
      catEnAddInput.style.display = "none";
      catAddBtn.style.display = "none";
    }
  });
}

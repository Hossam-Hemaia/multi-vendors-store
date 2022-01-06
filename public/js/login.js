// buttons
const DL_btn_customer = document.getElementById("DL_btn_customer");
const DL_btn_designer = document.getElementById("DL_btn_designer");
// forms
const DL_form_customer = document.getElementById("DL_form_customer");
const DL_form_designer = document.getElementById("DL_form_designer");
// span
const DL_usertype = document.getElementById("DL_usertype");

// designer btn event
DL_btn_designer.addEventListener("click", () => {
  if (DL_btn_customer.classList.contains("DL_active")) {
    DL_btn_customer.classList.remove("DL_active");
  }
  DL_btn_designer.classList.add("DL_active");
  DL_form_customer.classList.add("Dl_translate_back");
  DL_form_designer.classList.add("DL_translate_return");
  DL_usertype.innerHTML = "بائع";
});

// customer btn event
DL_btn_customer.addEventListener("click", () => {
  if (DL_btn_designer.classList.contains("DL_active")) {
    DL_btn_designer.classList.remove("DL_active");
  }
  DL_btn_customer.classList.add("DL_active");
  DL_form_customer.classList.remove("Dl_translate_back");
  DL_form_designer.classList.remove("DL_translate_return");
  DL_usertype.innerHTML = "مشترى";
});

const DR_btn_customer = document.getElementById("DR_btn-customer");
const DR_btn_designer = document.getElementById("DR_btn-designer");
const formsContent = document.querySelector(".DR_forms__errors");
const spanType = document.getElementById("DR_type");

// customer btn
DR_btn_customer.addEventListener("click", () => {
  if (!DR_btn_customer.classList.contains("DR_btn-active")) {
    DR_btn_designer.classList.remove("DR_btn-active");
    DR_btn_customer.classList.add("DR_btn-active");
    formsContent.classList.remove("DR_designer-show");
    spanType.innerHTML = "مشترى";
  }
});

// designer btn
DR_btn_designer.addEventListener("click", () => {
  if (!DR_btn_designer.classList.contains("DR_btn-active")) {
    DR_btn_customer.classList.remove("DR_btn-active");
    DR_btn_designer.classList.add("DR_btn-active");
    formsContent.classList.add("DR_designer-show");
    spanType.innerHTML = "بائع";
  }
});

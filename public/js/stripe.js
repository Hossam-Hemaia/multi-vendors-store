const paymentMethod = document.querySelectorAll("[name=paymentMethod]");
const csrf = document.querySelector("[name=_csrf]").value;
const orderBtn = document.getElementById("order");
orderBtn.addEventListener("click", () => {
  if (
    paymentMethod[0].checked === true &&
    paymentMethod[0].value === "postPaid"
  ) {
    fetch("/checkOut/postPaid/order", {
      method: "POST",
      headers: {
        "csrf-token": csrf,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        window.location.replace(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

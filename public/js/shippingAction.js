const shippingState = (btn) => {
  const csrf = document.querySelector("[name=_csrf]").value;
  const soldProductId = document.querySelector(`[name=product${btn.id}]`).value;
  const data = new URLSearchParams();
  data.append("soldProductId", soldProductId);
  fetch("/shipping/state", {
    method: "POST",
    body: data,
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      if (data.message === "changed") {
        btn.parentNode.parentNode.style.backgroundColor = "green";
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const shippingBtns = document.querySelectorAll(".shpngAct");
if (shippingBtns) {
  for (let i = 0; i < shippingBtns.length; ++i) {
    shippingBtns[i].addEventListener("click", (e) => {
      shippingState(e.target);
    });
  }
}

const rejectState = (btn) => {
  const csrf = document.querySelector("[name=_csrf]").value;
  const soldProductId = document.querySelector(
    `[name=product${+btn.id * -1}]`
  ).value;
  const data = new URLSearchParams();
  data.append("soldProductId", soldProductId);
  fetch("/reject/state", {
    method: "POST",
    body: data,
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      if (data.message === "changed") {
        btn.parentNode.parentNode.style.backgroundColor = "red";
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const rejectBtns = document.querySelectorAll(".rjctAct");
if (rejectBtns) {
  for (let i = 0; i < rejectBtns.length; ++i) {
    rejectBtns[i].addEventListener("click", (e) => {
      rejectState(e.target);
    });
  }
}

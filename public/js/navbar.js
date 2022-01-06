const navbarIcon = document.getElementById("navbar-toggle");
const navbarContent = document.getElementById("DNAV_content");
navbarIcon.addEventListener("click", () => {
  navbarIcon.classList.toggle("navbar__toggle-active");
  navbarContent.classList.toggle("DNAV_content-active");
});

const showList = () => {
  const csrf = document.querySelector("[name=_csrf]").value;
  const dropDown = document.querySelector(".dropdown-container");
  fetch("/show/listItems", {
    method: "GET",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      const ulExist = document.querySelector(".dropdown");
      if (!ulExist) {
        const ul = document.createElement("ul");
        ul.classList.add("dropdown");
        for (let item of data.categories) {
          if (ul.childNodes.length < data.categories.length) {
            let li = document.createElement("li");
            li.classList.add("dropdown__item");
            let a = document.createElement("a");
            a.href = "/category/" + item.catEnglishName;
            a.classList.add("dropdown__link");
            a.innerText = item.categoryName;
            li.append(a);
            ul.append(li);
          }
        }
        dropDown.append(ul);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const categoryBtn = document.getElementById("catBtn");
if (categoryBtn) {
  categoryBtn.addEventListener("click", () => {
    showList();
  });
}

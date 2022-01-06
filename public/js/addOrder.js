// create shipment btn
const createShipment = document.getElementById("creatShipment");
// seller name input
const sellerName = document.getElementById("sellerName");
// seller phone input
const sellerPhone = document.getElementById("sellerPhone");
// seller address input
const sellerAddress = document.getElementById("sellerAddress");
// product name input
const productName = document.getElementById("productName");
// note input
const Quantity = document.getElementById("quantity");
// sizes and colors
const specs = document.getElementById("specs");
// region selectbox
const region = document.getElementById("region");
// shipments container
const shipmentsContainer = document.getElementById("shipmentsContainer");
// shipments number
const shipmentsNumber = document.querySelector(".shipments_number");
// counter to give every select dirrerent class to select them
let counter = 0;

// create a new shipment
createShipment.addEventListener("click", (e) => {
  // disable sending data
  e.preventDefault();
  // check if the inputs empty to create shipment fn()
  if (
    sellerName.value !== "" &&
    sellerPhone !== "" &&
    sellerAddress !== "" &&
    productName !== ""
  ) {
    // create a new shipment
    createOne();
    // get and set the number of shipments card
    getThenumberOfShipments();
    // reset the value of inputs
    resetInputs();
  }
});

let editBtn, removeBtn;

// make a fn() on bottom part to add classes for all details of card
document
  .querySelector(".bottom-part .result-flex")
  .addEventListener("click", (e) => {
    // check if the target is the card options
    if (e.target.classList.contains("card-options")) {
      // showing card options
      e.target.classList.toggle("show-options");

      editBtn = e.target.querySelector(".option-edite");
      removeBtn = e.target.querySelector(".option-remove");
    }

    // set the fn() to show the inputs to edite
    editBtn.addEventListener("click", () => {
      // set class to show them
      editBtn.parentNode.parentNode.parentNode.classList.toggle("all-details");
    });

    // set a fn() to remove the item "card"
    removeBtn.addEventListener("click", () => {
      // the card element
      removeBtn.parentNode.parentNode.parentNode.remove();

      getThenumberOfShipments();
    });
  });

// get the bottom part to make a fn() on card btn
document
  .querySelector(".bottom-part .result-flex")
  .addEventListener("click", (e) => {
    // disable sending data
    e.preventDefault();
    // check if target is the btn
    if (e.target.classList.contains("edit-done")) {
      // specific the card
      let card = e.target.parentNode.parentNode.parentNode;
      // seller name in minimize
      const sellerN = card.querySelector(".result_seller-name");
      // seller name in edite form
      const NameInForm = card.querySelector(".sellerNameForm");
      // minimize name of product
      const name = card.querySelector(".result_name");
      // minimize price of product
      const price = card.querySelector(".result_price");
      // the input of product namein edite form
      const productName = card.querySelector(".productName");
      // the input of product price in edite form
      const productPrice = card.querySelector(".productPrice");

      // toggle class showing all details
      card.classList.toggle("all-details");
      // remove options when it's mini
      card.querySelector(".card-options").classList.remove("show-options");
      // set the name in minimum card
      name.innerHTML = productName.value;
      // set the price in minimum card
      price.innerHTML = productPrice.value;
      // set the seller name on minimize card
      sellerN.innerHTML = NameInForm.value;
    }
  });

// get and set the number of cards fn()
const getThenumberOfShipments = () => {
  // get the cards number
  const numberOfShipments = shipmentsContainer.querySelectorAll(".card").length;
  // set the cards number
  shipmentsNumber.innerHTML = numberOfShipments;

  const createOrder = document.querySelector(".btn-shipments--submit");

  if (numberOfShipments >= 1) {
    createOrder.style.display = "inline-block";
  } else {
    createOrder.style.display = "none";
  }
};

// reset the inputs value fn()
const resetInputs = () => {
  sellerName.value = "";
  sellerPhone.value = "";
  sellerAddress.value = "";
  Quantity.value = "";
  specs.value = "";
  sellerName.focus();
};
// create a shipment fn()
const createOne = () => {
  // template to make a card
  const template = `<div class="card">
        <div class="card-options">
            <span class="dote-1 dote"></span>
            <span class="dote-2 dote"></span>
            <span class="dote-3 dote"></span>
            <ul class="options">
                <li class="option option-edite">تعديل</li>
                <li class="option option-remove">حذف</li>
            </ul>
        </div>
        <!-- the info in small side -->
        <div class="minimize-result">
            <h2 class="result_seller-name">${sellerName.value}<h2>
            <h3 class="result_name">${productName.value}</h3>
            <h3 class="result_name">${Quantity.value}</h3>
        </div>
        <!-- all result -->
        <div class="all-result">
            <input type="text" name="clientName" placeholder="اسم العميل" class="sellerNameForm" value="${sellerName.value}">
            <input type="tel" name="clientNumber" placeholder="رقم العميل" value="${sellerPhone.value}">
            <input type="text" name="address" placeholder="العنوان (بالتفصيل)" value="${sellerAddress.value}">
            <input type="text" name="productName" placeholder="اسم المنتج" class="productName" value="${productName.value}">
            <input type="text" name="quantity" placeholder="ملحوظه بخصوص المنتج" class="note" value="${Quantity.value}">
            <input type="text" name="specs" class="note" placeholder="تفاصيل الطلب (الالوان والمقاسات)" value="${specs.value}" />
            <div class="select--container">
                <!-- first select for region -->
                <div class="region-select">
                    <label>المحافظه</label>
                    <select name="region" class="select${counter}">
                        <option value="Alexandria">الإسكندرية</option>
                        <!--1-->
                        <option value="Ismailia">الإسماعيلية</option>
                        <!--2-->
                        <option value="Aswan">أسوان</option>
                        <!--3-->
                        <option value="Asyut">أسيوط</option>
                        <!--4-->
                        <option value="Luxor">الأقصر</option>
                        <!--5-->
                        <option value="Red Sea">البحر الأحمر</option>
                        <!--6-->
                        <option value="Beheira">البحيرة</option>
                        <!--7-->
                        <option value="Beni Suef">بني سويف</option>
                        <!--8-->
                        <option value="Port Said">بورسعيد</option>
                        <!--9-->
                        <option value="South Sinai">جنوب سيناء</option>
                        <!--10-->
                        <option value="Giza">الجيزة</option>
                        <!--11-->
                        <option value="Dakahlia">الدقهلية</option>
                        <!--12-->
                        <option value="Damietta">دمياط</option>
                        <!--13-->
                        <option value="Sohag">سوهاج</option>
                        <!--14-->
                        <option value="Suez">السويس</option>
                        <!--15-->
                        <option value="Sharqia">الشرقية</option>
                        <!--16-->
                        <option value="North Sinai">شمال سيناء</option>
                        <!--17-->
                        <option value="Gharbia">الغربية</option>
                        <!--18-->
                        <option value="Faiyum">الفيوم</option>
                        <!--19-->
                        <option value="Cairo">القاهرة</option>
                        <!--20-->
                        <option value="Qalyubia">القليوبية</option>
                        <!--21-->
                        <option value="Qena">قنا</option>
                        <!--22-->
                        <option value="Kafr El Sheikh">كفر الشيخ</option>
                        <!--23-->
                        <option value="Matruh">مطروح</option>
                        <!--24-->
                        <option value="Monufia">المنوفية</option>
                        <!--25-->
                        <option value="Minya">المنيا</option>
                        <!--26-->
                        <option value="New Valley">الوادي الجديد</option>
                        <!--27-->
                    </select>
                </div>
            </div>
            <div class="center">
                <button class="edit-done" >تعديل</button>
            </div>
        </div>
    </div>`;

  // specifice where to put the card
  shipmentsContainer.insertAdjacentHTML("beforeend", template);
  // specific what region is
  shipmentsContainer.querySelector(`.select${counter}`).value = region.value;
  // add 1 to the counter to make a diffrent classes
  counter += 1;
};

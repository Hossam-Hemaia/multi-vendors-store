const deleteDesign = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const designElement = btn.closest("article");

  fetch("/designer/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      designElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteBtn = document.querySelectorAll(".dltDsin");
if (deleteBtn) {
  for (let i = 0; i < deleteBtn.length; ++i) {
    deleteBtn[i].addEventListener("click", (e) => {
      deleteDesign(e.target.parentNode);
    });
  }
}

const addToCart = (btn) => {
  const productId =
    btn.parentNode.parentNode.querySelector("[name=productId]").value;
  const color = btn.parentNode.parentNode.querySelector("[name=color]").value;
  const size = btn.parentNode.parentNode.querySelector("[name=size]").value;
  const csrf = btn.parentNode.parentNode.querySelector("[name=_csrf]").value;
  let data = new URLSearchParams();
  if (color !== "") {
    data.append("color", color);
  }
  if (size !== "") {
    data.append("size", size);
  }
  data.append("productId", productId);
  fetch("/addToCart/" + productId, {
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
      console.log(data);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const addToCrtBtn = document.querySelectorAll(".addToCrt");
if (addToCrtBtn) {
  for (let i = 0; i < addToCrtBtn.length; ++i) {
    addToCrtBtn[i].addEventListener("click", (e) => {
      addToCart(e.target.parentNode);
    });
  }
}

const copyLink = (btn) => {
  const productId =
    btn.parentNode.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.parentNode.querySelector("[name=_csrf]").value;
  fetch("/copyLink/" + productId, {
    method: "GET",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      const copyText = data.link;
      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.value = copyText;
      textInput.id = "lnk";
      document.body.append(textInput);
      textInput.select();
      textInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(textInput);
    })
    .catch((err) => {
      console.log(err);
    });
};

const copyLinkBtn = document.querySelectorAll(".copyLink");
if (copyLinkBtn) {
  for (let i = 0; i < copyLinkBtn.length; ++i) {
    copyLinkBtn[i].addEventListener("click", (e) => {
      copyLink(e.target.parentNode);
    });
  }
}

const paginate = () => {
  const itemPerPage = document.getElementById("IPP").value;
  console.log(itemPerPage);
  fetch("/market/all/" + itemPerPage, {
    method: "GET",
  })
    .then((result) => {
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
};

const paginateBtn = document.getElementById("pgnat");
if (paginateBtn) {
  paginateBtn.addEventListener("click", () => {
    paginate();
  });
}

const sellerEarnings = () => {
  const dateFrom = document.querySelector("[name=dateFrom]").value;
  const dateTo = document.querySelector("[name=dateTo]").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("dateFrom", dateFrom);
  data.append("dateTo", dateTo);
  fetch("/seller/earnings", {
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
      const table = document.getElementById("earningTbl");
      let totalEarnings = 0;
      for (let pkg of data.earnings) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        tdName.innerText = pkg.clientName;
        let tdPhone = document.createElement("td");
        tdPhone.innerText = pkg.clientNumber;
        let tdDate = document.createElement("td");
        tdDate.innerText = pkg.date;
        let tdTitle = document.createElement("td");
        tdTitle.innerText = pkg.productTitle;
        let tdQuantity = document.createElement("td");
        tdQuantity.innerText = pkg.quantity;
        let tdPrice = document.createElement("td");
        tdPrice.innerText = pkg.price;
        let tdAmount = document.createElement("td");
        tdAmount.innerText = pkg.price * pkg.quantity;
        let tdShipping = document.createElement("td");
        tdShipping.innerText =
          pkg.isShipped === true ? "تم الشحن" : "لم يتم الشحن";
        totalEarnings += pkg.price * pkg.quantity;
        tr.append(
          tdName,
          tdPhone,
          tdDate,
          tdTitle,
          tdQuantity,
          tdPrice,
          tdAmount,
          tdShipping
        );
        table.append(tr);
      }
      const total = document.querySelector(".typo__total");
      total.innerText = totalEarnings;
    })
    .catch((err) => {
      console.log(err);
    });
};

const sellerEarningsBtn = document.getElementById("slrErnRprt");
if (sellerEarningsBtn) {
  sellerEarningsBtn.addEventListener("click", () => {
    sellerEarnings();
  });
}

const withdrawBalance = () => {
  const amount = document.getElementById("amount").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  let data = new URLSearchParams();
  data.append("amount", amount);
  fetch("/seller/withdrawBalance", {
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
      if (data.errorMessage) {
        const p = document.getElementById("errMsg");
        p.innerText = data.errorMessage;
      } else {
        let currentTransaction =
          data.transactions[data.transactions.length - 1];
        const table = document.getElementById("transactionsTbl");
        if (table) {
          const tr = document.createElement("tr");
          const td_amount = document.createElement("td");
          td_amount.innerText = currentTransaction.withdrawAmount;
          const td_date = document.createElement("td");
          td_date.innerText = currentTransaction.withdrawDate;
          const td_status = document.createElement("td");
          td_status.innerText = currentTransaction.withdrawStatus;
          tr.append(td_amount, td_date, td_status);
          table.append(tr);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const withdrawBtn = document.getElementById("wthdrw");
if (withdrawBtn) {
  withdrawBtn.addEventListener("click", () => {
    withdrawBalance();
  });
}

const shippingReport = () => {
  const dateFrom = document.querySelector("[name=dateFrom]").value;
  const dateTo = document.querySelector("[name=dateTo]").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("dateFrom", dateFrom);
  data.append("dateTo", dateTo);
  fetch("/shipping/report", {
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
      const table = document.getElementById("shippingTbl");
      let idCounter = 1;
      let rejIdCounter = -1;
      for (let pkg of data.shippings) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        tdName.innerText = pkg.clientName;
        let tdPhone = document.createElement("td");
        tdPhone.innerText = pkg.clientNumber;
        let tdAddress = document.createElement("td");
        tdAddress.innerText = pkg.address;
        let tdRegion = document.createElement("td");
        tdRegion.innerText = pkg.region;
        let tdDate = document.createElement("td");
        tdDate.innerText = pkg.date;
        let aTitle = document.createElement("a");
        aTitle.href = `/market/productDetails/${pkg.productId}`;
        aTitle.target = "_blank";
        aTitle.innerText = pkg.productTitle;
        let tdTitle = document.createElement("td");
        tdTitle.appendChild(aTitle);
        let tdDescription = document.createElement("td");
        tdDescription.innerText = pkg.productDescription;
        let tdQuantity = document.createElement("td");
        tdQuantity.innerText = pkg.quantity;
        let tdPrice = document.createElement("td");
        tdPrice.innerText = pkg.price;
        let tdShippingFees = document.createElement("td");
        tdShippingFees.innerText = pkg.shippingFees;
        let tdAmount = document.createElement("td");
        tdAmount.innerText = pkg.price * pkg.quantity;
        let tdSeller = document.createElement("td");
        tdSeller.innerText = pkg.sellerName;
        let tdMarketer = document.createElement("td");
        tdMarketer.innerText = pkg.marketerName || "بيع مباشر";
        let tdShipped = document.createElement("td");
        tdShipped.innerText =
          pkg.isShipped === false ? "لم يتم الشحن" : "تم الشحن";
        let idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.value = pkg.id;
        idInput.name = "product" + idCounter;
        let tdButton = document.createElement("td");
        let actionBtn = document.createElement("button");
        actionBtn.type = "button";
        actionBtn.id = idCounter;
        actionBtn.classList.add("shpngAct");
        actionBtn.innerText = "شحن";
        let hr = document.createElement("hr");
        let rejectBtn = document.createElement("button");
        rejectBtn.type = "button";
        rejectBtn.id = rejIdCounter;
        rejectBtn.classList.add("rjctAct");
        rejectBtn.innerText = "مرتجع";
        tdButton.append(actionBtn, hr, rejectBtn);
        tr.append(
          tdName,
          tdPhone,
          tdAddress,
          tdRegion,
          tdDate,
          tdTitle,
          tdDescription,
          tdQuantity,
          tdPrice,
          tdShippingFees,
          tdAmount,
          tdSeller,
          tdMarketer,
          tdShipped,
          tdButton,
          idInput
        );
        table.append(tr);
        ++idCounter;
        --rejIdCounter;
      }
      const shippingAction = document.createElement("script");
      shippingAction.src = "/js/shippingAction.js";
      document.body.append(shippingAction);
    })
    .catch((err) => {
      console.log(err);
    });
};

const salesReport = () => {
  const dateFrom = document.querySelector("[name=dateFrom]").value;
  const dateTo = document.querySelector("[name=dateTo]").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("dateFrom", dateFrom);
  data.append("dateTo", dateTo);
  fetch("/sales/report", {
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
      const table = document.getElementById("shippingTbl");
      for (let pkg of data.sales) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        tdName.innerText = pkg.clientName;
        let tdPhone = document.createElement("td");
        tdPhone.innerText = pkg.clientNumber;
        let tdAddress = document.createElement("td");
        tdAddress.innerText = pkg.address;
        let tdDate = document.createElement("td");
        tdDate.innerText = pkg.date;
        let aTitle = document.createElement("a");
        aTitle.href = `/market/productDetails/${pkg.productId}`;
        aTitle.target = "_blank";
        aTitle.innerText = pkg.productTitle;
        let tdTitle = document.createElement("td");
        tdTitle.appendChild(aTitle);
        let tdQuantity = document.createElement("td");
        tdQuantity.innerText = pkg.quantity;
        let tdPrice = document.createElement("td");
        tdPrice.innerText = pkg.price;
        let tdShippingFees = document.createElement("td");
        tdShippingFees.innerText = pkg.shippingFees;
        let tdAmount = document.createElement("td");
        tdAmount.innerText = pkg.price * pkg.quantity;
        let tdSeller = document.createElement("td");
        tdSeller.innerText = pkg.sellerName;
        let tdMarketer = document.createElement("td");
        tdMarketer.innerText = pkg.marketerName || "بيع مباشر";
        let tdCommission = document.createElement("td");
        tdCommission.innerText = pkg.quantity * pkg.commission * pkg.price;
        let tdٍMarketerCommission = document.createElement("td");
        tdٍMarketerCommission.innerText =
          pkg.quantity * pkg.marketerCommission || "لا يوجد عموله";
        tr.append(
          tdName,
          tdPhone,
          tdAddress,
          tdDate,
          tdTitle,
          tdQuantity,
          tdPrice,
          tdShippingFees,
          tdAmount,
          tdSeller,
          tdMarketer,
          tdCommission,
          tdٍMarketerCommission
        );
        table.append(tr);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const shippingReportBtn = document.getElementById("shpngRprt");
const reportDownload = document.querySelector(".rprtDownload");
if (shippingReportBtn) {
  shippingReportBtn.addEventListener("click", () => {
    const reportType = document.querySelectorAll("[name=reportType]");
    for (let i = 0; i < reportType.length; ++i) {
      if (
        reportType[i].value === "shipping" &&
        reportType[i].checked === true
      ) {
        shippingReport();
      } else if (
        reportType[i].value === "sales" &&
        reportType[i].checked === true
      ) {
        let commission = document.getElementById("shipstts");
        let marketerCommission = document.getElementById("shipact");
        let productDescription = document.getElementById("prdctdscr");
        let region = document.getElementById("rgn");
        region.remove();
        productDescription.remove();
        commission.innerText = "عمولة البيع";
        marketerCommission.innerText = "عمولة المسوق";
        salesReport();
      }
    }
    shippingReportBtn.disabled = true;
    reportDownload.disabled = false;
  });
}

function download_csv(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV FILE
  csvFile = new Blob([csv], { type: "text/csv" });

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // We have to create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Make sure that the link is not displayed
  downloadLink.style.display = "none";

  // Add the link to your DOM
  document.body.appendChild(downloadLink);

  // Lanzamos
  downloadLink.click();
}

function export_table_to_csv(html, filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

    csv.push(row.join(","));
  }

  // Download CSV
  download_csv(csv.join("\n"), filename);
}

const reportDownBtn = document.querySelector(".rprtDownload");
if (reportDownBtn) {
  reportDownBtn.addEventListener("click", function () {
    const html = document.querySelector("table").outerHTML;
    export_table_to_csv(html, "report.csv");
  });
}

const productRating = (value) => {
  const productId = document.querySelector("[name=productId]").value;
  const rating = value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("productId", productId);
  data.append("rating", rating);
  fetch("/product/rating", {
    method: "POST",
    body: data,
    headers: {
      "csrf-token": csrf,
    },
  }).catch((err) => {
    console.log(err);
  });
};

const star = document.querySelector(".star");
if (star) {
  star.addEventListener("click", (e) => {
    if (e.target.value !== undefined) {
      let ratingVal = e.target.value;
      productRating(ratingVal);
    }
  });
}

const deleteProductPlan = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  const cardElement = btn.closest("article");

  fetch("/productPlan/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

const deletePPlanBtn = document.querySelectorAll(".dltprdctpln");
if (deletePPlanBtn) {
  for (let i = 0; i < deletePPlanBtn.length; ++i) {
    deletePPlanBtn[i].addEventListener("click", (e) => {
      deleteProductPlan(e.target.parentNode);
    });
  }
}

const marketerOrderReport = () => {
  const dateFrom = document.querySelector("[name=dateFrom]").value;
  const dateTo = document.querySelector("[name=dateTo]").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("dateFrom", dateFrom);
  data.append("dateTo", dateTo);
  fetch("/marketer/order/report", {
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
      const table = document.getElementById("shippingTbl");
      for (let pkg of data.pkgs) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        tdName.innerText = pkg.clientName;
        let tdPhone = document.createElement("td");
        tdPhone.innerText = pkg.clientNumber;
        let tdAddress = document.createElement("td");
        tdAddress.innerText = pkg.address;
        let tdDate = document.createElement("td");
        tdDate.innerText = pkg.date;
        let tdTitle = document.createElement("td");
        tdTitle.innerText = pkg.productTitle;
        let tdQuantity = document.createElement("td");
        tdQuantity.innerText = pkg.quantity;
        let tdPrice = document.createElement("td");
        tdPrice.innerText = pkg.price;
        let tdAmount = document.createElement("td");
        tdAmount.innerText = pkg.price * pkg.quantity;
        let tdMarketer = document.createElement("td");
        tdMarketer.innerText = pkg.marketerName;
        let tdCommission = document.createElement("td");
        tdCommission.innerText = pkg.quantity * pkg.commission;
        tr.append(
          tdName,
          tdPhone,
          tdAddress,
          tdDate,
          tdTitle,
          tdQuantity,
          tdPrice,
          tdAmount,
          tdMarketer,
          tdCommission
        );
        table.append(tr);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const orderReportBtn = document.getElementById("ordrRprt");
if (orderReportBtn) {
  orderReportBtn.addEventListener("click", () => {
    marketerOrderReport();
  });
}

const addCategory = () => {
  const categoryName = document.querySelector("[name=categoryName]").value;
  const catEnglishName = document.querySelector("[name=catEnglishName]").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("categoryName", categoryName);
  data.append("catEnglishName", catEnglishName);
  fetch("/add/category", {
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
      if (data.message === "success") {
        location.replace("/dashBoard");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const addCategoryBtn = document.getElementById("addCat");
if (addCategoryBtn) {
  addCategoryBtn.addEventListener("click", () => {
    addCategory();
  });
}

const modifyCategory = () => {
  const selectedCategory = document.querySelector("[name=category]").value;
  const categoryName = document.querySelector("[name=categoryName]").value;
  const catEnglishName = document.querySelector("[name=catEnglishName]").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("selectedCategory", selectedCategory);
  data.append("categoryName", categoryName);
  data.append("catEnglishName", catEnglishName);
  fetch("/modify/category", {
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
      if (data.message === "success") {
        location.replace("/dashBoard");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const modCategoryBtn = document.getElementById("modCat");
if (modCategoryBtn) {
  modCategoryBtn.addEventListener("click", () => {
    modifyCategory();
  });
}

const allImages = document.querySelectorAll(".allImages");
if (allImages) {
  for (let image of allImages) {
    image.addEventListener("mouseover", () => {
      let mainImage = document.getElementById("mainImage");
      mainImage.src = image.src;
    });
  }
}

const downloadProductImages = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  fetch("/product/imagesDownload/" + productId, {
    method: "GET",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then(async (res) => ({
      filename: res.headers.get("content-disposition").split("=")[1],
      blob: await res.blob(),
    }))
    .then((resObj) => {
      const newBlob = new Blob([resObj.blob], { type: "application/zip" });
      const fileUrl = URL.createObjectURL(newBlob);
      window.open(fileUrl);
    })
    .catch((err) => {
      console.log(err);
    });
};

const downloadImageBtn = document.querySelectorAll(".dwnldImgs");
if (downloadImageBtn) {
  for (let i = 0; i < downloadImageBtn.length; ++i) {
    downloadImageBtn[i].addEventListener("click", (e) => {
      downloadProductImages(e.target.parentNode);
    });
  }
}

const feeSelections = document.querySelectorAll(".fee__select");
if (feeSelections) {
  for (let i = 0; i < feeSelections.length; ++i) {
    feeSelections[i].addEventListener("click", () => {
      window.open("/region/shippingTable", "name", "width=400,height=600");
    });
  }
}

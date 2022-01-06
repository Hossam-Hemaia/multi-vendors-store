const fs = require("fs");

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.toIsoDate = (date, str) => {
  if (str === "start") {
    let newDate = new Date(date);
    return newDate.toISOString();
  } else {
    let newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 23);
    return newDate.toISOString();
  }
};

exports.shortDate = (str) => {
  const shortStr = str.substr(0, str.indexOf("GMT"));
  return shortStr;
};

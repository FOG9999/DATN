// Nhận vào chuỗi '', '123', '123.123.122'
const turnNumberWithSeperatorIntoNumber = (numberWithSeperator) => {
  if (!numberWithSeperator) {
    return "";
  } else if (numberWithSeperator.includes(".")) {
    let parts = numberWithSeperator.split(".");
    let output = "";
    parts.forEach((part) => (output += part));
    return parseInt(output);
  } else return parseInt(numberWithSeperator);
};

// Nhận vào 1 số
const turnNumberToNumberWithSeperator = (number) => {
  number = number.toString();
  if (number >= 1000) {
    let parts = [];
    let numberStr = number.toString();
    let i = 0;
    for (i = numberStr.length; i >= 3; i -= 3) {
      parts.push(numberStr.substring(i - 3, i));
    }
    if (i !== 0) {
      parts.push(numberStr.substring(0, i));
    }
    parts.reverse();
    let output = parts[0];
    parts.shift();
    parts.forEach((part) => (output += "." + part));
    return output;
  } else {
    return number;
  }
};

export { turnNumberWithSeperatorIntoNumber, turnNumberToNumberWithSeperator };

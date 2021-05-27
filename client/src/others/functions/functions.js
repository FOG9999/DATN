export const Functions = {
  displayOrderStatus: (key) => {
    switch (key) {
      case "0":
        return "Chờ xác nhận";
      case "3":
        return "Trả hàng";
      case "2":
        return "Đã nhận hàng";
      case "1":
        return "Đang giao hàng";
      case "-1":
        return "Đã hủy đơn";
      default:
        break;
    }
  },
};

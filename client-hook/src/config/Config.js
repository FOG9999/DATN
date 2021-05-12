const Config = {
  AuthServer: "http://localhost:4000",
  ResourceServer: "http://localhost:5000",
  UploadServer: "http://localhost:9000",
  ROLE: {
    SYSTEM: {
      admin: "ADMIN",
      mod: "MOD",
      driver: "DRIVER",
    },
    CLIENT: "CLIENT",
  },
  Order: {
    status: {
      waiting: "0",
      delivering: "1",
      return: "3",
      success: "2",
      cancel: "-1",
    },
    delivery_type: {
      self: "self",
      deliver: "deliver",
    },
    order_type: {
      self: "Tự lấy hàng",
      deliver: "Giao hàng tận nhà",
    },
  },
  PRD_STATUS: {
    A: "Active",
    W: "Waiting",
    S: "Sold",
    D: "Deleted",
  },
};

export { Config };

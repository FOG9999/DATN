const faker = require("faker");

const status = ["W", "D", "R", "C"];

const units = ["Kg", "Con", "Quả", ""];

const items = () => {
  let items = [];
  for (let i = 0; i < 100; i++) {
    let item = {
      title: faker.commerce.productName(),
      quantity: Math.round(Math.random() * 5),
      price: Math.round(Math.random() * 100000),
      image:
        "https://pokervnbet77.com/wp-content/uploads/2020/09/tong-hop-gai-xinh-ha-noi-hot-girl-viet.png",
      createdAt: faker.date.recent(20),
      type: Math.round(Math.random() * 1) % 2 ? "F" : "I",
      sold: Math.round(Math.random() * 100),
    };
    items.push(item);
  }
  return items;
};

const users = () => {
  let users = [];
  for (let i = 0; i < 10; i++) {
    let user = {
      name: faker.name.findName(),
      birthday: faker.date.past(10),
      username: "username " + i,
      phone: faker.phone.phoneNumber(),
      address: {
        street: "Đại La",
        district: "Hai Bà Trưng",
        convince: "Hà Nội",
        detail_address: "Ngõ Tân Lạc",
      },
      avatar:
        "https://i.imgur.com/3McFm3K_d.webp?maxwidth=640&shape=thumb&fidelity=medium",
    };
    users.push(user);
  }
  return users;
};

const orders = () => {
  let orders = [];
  let us = users();
  let its = items();
  //console.log(us, its);
  for (let i = 0; i < 20; i++) {
    let buyer = us[Math.round(Math.random() * 9)];
    let order = {
      on_date: faker.date.recent(100),
      buyer: { ...buyer },
      accepted: Math.round(Math.random() * 100) % 2 === 1 ? true : false,
      delivery_type: Math.round(Math.random() * 100) % 2 === 1 ? true : false,
      total: Math.round(Math.random() * 1000000),
      items: its.slice(0, Math.round(Math.random() * 3)),
      unit: units[Math.round(Math.random() * units.length)],
      location: { ...buyer.address },
      processed_date: null,
      delivery_date: null,
      payment_method: Math.round(Math.random() * 1), // 0: trả khi nhận được hàng, 1: thanh toán bằng thẻ
      status: status[Math.round(Math.random() * (status.length - 1))],
      // wait: W, deliverying: D, received: R, return: C
    };
    orders.push(order);
  }
  return orders;
};

// console.log(new Date(orders()[0].on_date).toLocaleDateString());

export { items, users, orders };

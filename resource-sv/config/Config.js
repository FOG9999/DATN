module.exports = {
  STATUS: {
    A: "Active",
    W: "Waiting",
    S: "Sold",
  },
  ROLE: {
    SYSTEM: {
      admin: "ADMIN",
      mod: "MOD",
      driver: "DRIVER",
    },
    CLIENT: "CLIENT",
  },
  port: process.env.PORT || 5000,
  uri:
    "mongodb+srv://fog:thang20899@cluster0.duano.mongodb.net/hn-std-mkt?retryWrites=true&w=majority",
  RECOMMEND_SV: "https://nice-talented-heather.glitch.me/",
  SHOPEE_URL:
    "https://shopee.vn/api/v4/recommend/recommend?bundle=daily_discover_main&item_card=3&limit=80&offset=0",
  SENDO_URL:
    "https://searchlist-api.sendo.vn/web/categories/2399/products?listing_algo=algo13&page=1&platform=web&size=60&sortType=vasup_desc",
};

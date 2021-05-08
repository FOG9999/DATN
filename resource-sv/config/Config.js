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
  // RECOMMEND_SV: "https://nice-talented-heather.glitch.me/",
  RECOMMEND_SV: "http://localhost:6000",
  SHOPEE_URL:
    "https://shopee.vn/api/v4/search/search_items?by=relevancy&keyword=trang%20tr%C3%AD&limit=15&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2",
  SENDO_URL:
    "https://searchlist-api.sendo.vn/web/categories/2399/products?listing_algo=algo13&page=1&platform=web&size=60&sortType=vasup_desc",
  CHOPP_URL:
    "https://chopp.vn/api/group/products?populate=true&groupBy=category&locale=vi&page=1&limit=30&groupLimit=24&where={%22stores%22:%22rec3QEkwij7iPa2Oz%22}&segment=recgOahZUvejuv2WV",
};

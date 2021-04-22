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
};

module.exports = {
  uri:
    "mongodb+srv://fog:thang20899@cluster0.duano.mongodb.net/hn-std-mkt?retryWrites=true&w=majority",
  port: process.env.PORT || 4000,
  secret: "06102020",
  role: {
    system: {
      admin: "ADMIN",
      mod: "MOD",
      driver: "DRIVER",
    },
    client: "CLIENT",
  },
  status: {
    A: "ACTIVE",
    B: "BLOCKED",
    D: "DELETED",
  },
};

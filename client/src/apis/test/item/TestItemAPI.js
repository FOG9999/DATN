const TestItemAPI = {
  // getRecentlyView: (cb) => {

  // },
  recommend: (cb) => {
    fetch(
      `https://6042e02a7f50e000173ac980.mockapi.io/api/test/users/${Math.floor(
        20 * Math.random()
      )}/items`
    )
      .then((res) => res.json())
      .then((items) => cb(items));
  },
};

export { TestItemAPI };

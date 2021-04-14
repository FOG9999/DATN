const generateItems = (number) => {
  let items = [];
  for (let i = 0; i < number; i++) {
    items.push(`i${i}`);
  }
  return items;
};

const generateUsers = (number) => {
  let users = [];
  for (let i = 0; i < number; i++) {
    users.push(`u${i}`);
  }
  return users;
};

const generateRatings = (users, items) => {
  let ratings = [];
  users.forEach((user) => {
    let numOfRatings = Math.round(Math.random() * 10) + 20; // 20-30
    let rdIndexInItems = 0;
    let newRating = { [user]: [] };
    for (let i = 0; i < numOfRatings; i++) {
      rdIndexInItems = Math.round(Math.random() * (items.length - 1));
      newRating[`${user}`].push(
        JSON.stringify({
          item: items[rdIndexInItems],
          rate: Math.round(Math.random() * 9) + 1,
        })
      );
    }
    ratings.push(newRating);
  });
  return ratings;
};

var users = generateUsers(100);
var items = generateItems(1500);
var ratings = generateRatings(users, items);

console.log(ratings);

// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const path = require("path");
const upload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://fog:thang20899@cluster0.duano.mongodb.net/hn-std-mkt?retryWrites=true&w=majority";

const UserRatingController = require("./controller/UserRatingController");
const ProductController = require("./controller/ProductController");
const UserController = require("./controller/UserController");

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(upload());
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/public/img/:img", (req, res, next) => {
  var img = req.params.img;
  if (!img) return res.status(400).json({ msg: "Not found" });
  res.sendFile(path.resolve("./views/" + img));
});

app.post("/upload", (req, res) => {
  console.log(req);
  let files = [];
  for (let i = 0; i < 9; i++) {
    if (req.files[`file${i}`]) {
      files.push(req.files[`file${i}`]);
    } else break;
  }

  files.forEach((file, index) => {
    file.mv(`${__dirname}/views/${file.name}`, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          msg: err,
        });
      }
    });
  });

  res.send({ msg: "upload successfully" });
});

const calculatePearsonArray = (users, products, ratings) => {
  let pearsonArr = {};
  let averages = [];
  // calculate average rating for each item
  for (let i = 0; i < products.length; i++) {
    let counter = 0,
      total = 0;
    let filterForI = ratings.filter(
      (rating) => String(rating["product"]) === String(products[i])
    );
    filterForI.forEach((rating) => {
      counter++;
      total += rating.rating;
    });
    averages.push({
      [products[i]]: isNaN(total / counter) ? 0 : total / counter,
    });
  }

  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < products.length && j !== i; j++) {
      // kiểm tra trong pearson Aray đã có 2 phần tử này chưa
      if (
        Object.keys(pearsonArr).indexOf(`${products[i]},${products[j]}`) > 0 ||
        Object.keys(pearsonArr).indexOf(`${products[j]},${products[i]}`) > 0
      ) {
        continue;
      } else {
        let sumA = 0,
          sumB = 0,
          sumC = 0;
        let filterRateForI = ratings.filter(
          (rating) => String(rating.product) === String(products[i])
        );
        let filterRateForJ = ratings.filter(
          (rating) => String(rating.product) === String(products[j])
        );
        let ri, rj;
        ri = averages.filter((av) => av[`${products[i]}`] !== undefined)[0][
          `${products[i]}`
        ];
        rj = averages.filter((av) => av[`${products[j]}`] !== undefined)[0][
          `${products[j]}`
        ];
        for (let m = 0; m < users.length; m++) {
          let user_id = users[m];
          let ui, uj;
          if (
            filterRateForI.filter((r) => String(r.user) === String(user_id))
              .length > 0
          ) {
            ui = filterRateForI.filter(
              (r) => String(r.user) === String(user_id)
            )[0].rating;
          } else break;
          if (
            filterRateForJ.filter((r) => String(r.user) === String(user_id))
              .length > 0
          ) {
            uj = filterRateForJ.filter(
              (r) => String(r.user) === String(user_id)
            )[0].rating;
          } else break;
          sumA += (ui - ri) * (uj - rj);
          sumB += Math.pow(ui - ri, 2);
          sumC += Math.pow(uj - rj, 2);
        }
        let pearson = sumA / (Math.sqrt(sumB) * Math.sqrt(sumC));
        pearsonArr[`${products[i]},${products[j]}`] = isNaN(pearson)
          ? 0
          : pearson;
        // console.log(sumA,sumB,sumC)
      }
    }
  }
  return pearsonArr;
};

// const getSimilarity = (items, users, ratings, i, j) => {
//   let pearsonArr = calculatePearsonArray(users, items, ratings);
//   return pearsonArr[`i${i},i${j}`]
//     ? pearsonArr[`i${i},i${j}`]
//     : pearsonArr[`i${j},i${i}`];
// };

const simpleWeightedAverage = (items, ratings, pearsonArr, i, u) => {
  let userrating = ratings.filter(
    (rating) => String(rating.user) === String(u) && rating.rating > 0
  );
  let sumA = 0,
    sumB = 0;
  for (
    let j = 0;
    j < userrating.length && String(i) !== String(userrating[j].product);
    j++
  ) {
    let uj = userrating[j].rating;
    let ij =
      pearsonArr[`${i},${userrating[j].product}`] !== undefined
        ? pearsonArr[`${i},${userrating[j].product}`]
        : pearsonArr[`${userrating[j].product},${i}`];
    if (ij >= 0.3) {
      sumA += uj * ij;
      sumB += Math.abs(ij);
    }
  }
  return isNaN(sumA / sumB) ? -1 : sumA / sumB;
};

app.get("/collaborative-filter/recommend/:u", (req, res, next) => {
  const u = req.params.u;
  const products = [];
  const users = [];
  const ratings = [];
  UserRatingController.getAllRatings((rating_rs) => {
    if (rating_rs.data) {
      ratings.push(...rating_rs.data);
      UserController.getAllUserIDs((user_rs) => {
        if (user_rs.data) {
          users.push(...user_rs.data);
          ProductController.getAllProducts((pro_rs) => {
            if (pro_rs.data) {
              products.push(...pro_rs.data.items, ...pro_rs.data.food);
              // get all done
              // start calculate pearson array
              let pearsonArr = calculatePearsonArray(users, products, ratings);
              let likedByU = ratings.filter(
                (ele) => ele.rating > 0 && String(ele.user) === String(u)
              );
              let similarities = [];
              let greatestArr = [];
              let addedItems = [];
              likedByU.forEach((like) => {
                let allSimilar = Object.keys(pearsonArr).filter((property) =>
                  property.includes(like.product)
                );
                // let greatestSim = allSimilar[0];
                // tìm những item liên quan nhất tới từng item mà user đã đánh giá
                for (let i = 1; i < allSimilar.length; i++) {
                  if (
                    pearsonArr[`${allSimilar[i]}`] > 0 &&
                    greatestArr.indexOf(allSimilar[i]) < 0
                    // pearsonArr[`${greatestSim}`]
                  ) {
                    // greatestSim = allSimilar[i];
                    greatestArr.push(allSimilar[i]);
                  }
                }
                // greatestArr.push(greatestSim);
              });
              let likedItems = likedByU.map((like, index) =>
                String(like.product)
              );
              let greatestArrOutput = [];
              greatestArr.forEach((gr) => {
                let notLikedByU = gr
                  .split(",")
                  .filter((item) => likedItems.indexOf(String(item)) < 0); // lọc ra những item liên quan nhất nhưng chưa được thích bởi user
                if (
                  notLikedByU.length > 0 &&
                  greatestArrOutput.indexOf(notLikedByU[0]) < 0
                ) {
                  greatestArrOutput.push(notLikedByU[0]);
                }
              });
              let topNItems = [];
              greatestArrOutput.forEach((greatest) => {
                topNItems.push({
                  item: greatest,
                  predictRate: simpleWeightedAverage(
                    products,
                    ratings,
                    pearsonArr,
                    greatest,
                    u
                  ),
                });
              });
              // let uForI = simpleWeightedAverage(items, ratings, pearsonArr, itemi, u)
              res.send({
                // uForI: uForI,
                ratings: [...ratings],
                pearsonArr: { ...pearsonArr },
                topNItems: [...topNItems],
              });
            } else res.send(pro_rs);
          });
        } else res.send(user_rs);
      });
    } else res.send(rating_rs);
  });
});

app.get("/collaborative-filter/new-user", (req, res, next) => {
  const products = [];
  const users = [];
  const ratings = [];
  let averages = [],
    output = [];
  UserRatingController.getAllRatings((rating_rs) => {
    if (rating_rs.data) {
      ratings.push(...rating_rs.data);
      UserController.getAllUserIDs((user_rs) => {
        if (user_rs.data) {
          users.push(...user_rs.data);
          ProductController.getAllProducts((pro_rs) => {
            if (pro_rs.data) {
              products.push(...pro_rs.data.items, ...pro_rs.data.food);
              // calculate average rating for each item
              for (let i = 0; i < products.length; i++) {
                let counter = 0,
                  total = 0;
                let filterForI = ratings.filter(
                  (rating) => String(rating["product"]) === String(products[i])
                );
                filterForI.forEach((rating) => {
                  counter++;
                  total += rating.rating;
                });
                // averages.push({
                //   [products[i]]: isNaN(total / counter) ? 0 : total / counter
                // });
                if (!isNaN(total / counter)) {
                  if (total / counter > 0) {
                    output.push({
                      itemID: products[i],
                      average: total / counter,
                    });
                  }
                }
              }
              // lấy các sản phẩm được đánh giá > 0.5
              // let output = averages.filter(aver => aver.rating > 0.5)
              res.send({
                averages: [...output],
              });
            } else res.send(pro_rs);
          });
        } else res.send(user_rs);
      });
    } else res.send(rating_rs);
  });
});

app.get("/collaborative-filter/product-relate/:p", (req, res, next) => {
  const product = req.params.p;
  const products = [];
  const users = [];
  const ratings = [];
  UserRatingController.getAllRatings((rating_rs) => {
    if (rating_rs.data) {
      ratings.push(...rating_rs.data);
      UserController.getAllUserIDs((user_rs) => {
        if (user_rs.data) {
          users.push(...user_rs.data);
          ProductController.getAllProducts((pro_rs) => {
            if (pro_rs.data) {
              products.push(...pro_rs.data.items, ...pro_rs.data.food);
              // get all done
              let pearsonArr = calculatePearsonArray(users, products, ratings);
              let pearsons = [];
              products.forEach((pro) => {
                if (product !== String(pro._id))
                  pearsons.push({
                    product: pro,
                    pearson:
                      pearsonArr[`${product},${pro._id}`] !== undefined
                        ? pearsonArr[`${product},${pro._id}`]
                        : pearsonArr[`${pro._id},${product}`],
                  });
              });
              pearsons.sort((a, b) => b.pearson - a.pearson);
              res.send({
                EC: 0,
                EM: "Success",
                suggestion: [...pearsons.splice(0, 5)],
                pearsonArr: pearsonArr,
              });
            } else res.send(pro_rs);
          });
        } else res.send(user_rs);
      });
    } else res.send(rating_rs);
  });
});

app.get("/most-popular", (req, res, next) => {
  ProductController.getMostPopular(req.query.limit, (rs) => {
    res.send(rs);
  });
});

app.post("/product/relate", (req, res, next) => {
  const { type, category, limit } = req.body;
  ProductController.getRelatedProducts(type, category, limit, (rs) => {
    res.send(rs);
  });
});

mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database connected ...");
  }
);

// listen for requests :)
const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log("Recommend-Upload server is listening on port " + port);
});

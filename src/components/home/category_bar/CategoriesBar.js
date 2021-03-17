import { Box, Divider } from "@material-ui/core";
import React, { Component } from "react";
import kitchen from "../../../images/kitchen.png";
import woman from "../../../images/woman.png";
import man from "../../../images/man.png";
import clothes from "../../../images/clothes.png";
import makeup from "../../../images/makeup.png";
import kids from "../../../images/kids.png";
import accessories from "../../../images/accessories.png";
import books from "../../../images/books.png";
import furniture from "../../../images/furniture.png";
import OneCategory from "./OneCategory";

const categories = [
  { title: "Đồ dùng trong nhà", cateImg: furniture },
  { title: "Con gái", cateImg: woman },
  { title: "Con trai", cateImg: man },
  { title: "Phụ kiện", cateImg: accessories },
  { title: "Trẻ em", cateImg: kids },
  { title: "Make up", cateImg: makeup },
  { title: "Quần áo", cateImg: clothes },
  { title: "Đồ dùng trong bếp", cateImg: kitchen },
  { title: "Sách truyện", cateImg: books },
];

class CategoryBar extends Component {
  state = {};
  render() {
    return (
      <Box className="white-background">
        <Box p={2}>
          <big>DANH MỤC</big>
        </Box>
        <Divider />
        <Box display="flex">
          {categories.map((cate, index) => {
            return (
              <OneCategory
                title={cate.title}
                cateImg={cate.cateImg}
                key={index}
              />
            );
          })}
        </Box>
      </Box>
    );
  }
}

export default CategoryBar;

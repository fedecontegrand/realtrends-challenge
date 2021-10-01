import {Product, Vote} from "./types";
export const product0: Product = {
  name: "Product A title",
  description:
"Product B description",
  image:
"//placehold.it/256x256",
  key: "!",
};
export const product1: Product = {
  name: "Product B title",
  description:
"Product B description",
  image:
"//placehold.it/256x256",
  key: "3",
};
export const vote0: Vote = {
  product: "!",
  user: "fede",
  comment: "Muy bueno",
};
export const vote1: Vote = {
  product: "3",
  user: "not-fede",
  comment: "Bueno",
};
export const vote2: Vote = {
  product: "3",
  user: "not-not-fede",
  comment: "Regular",
};

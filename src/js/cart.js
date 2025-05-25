import ShoppingCart from "./ShoppingCart.mjs";
import { loadHeaderFooter } from "./utils.mjs";

//Loade Header and Footer
loadHeaderFooter();

const productList = document.querySelector(".product-list");

const shoppingCart = new ShoppingCart(productList);
shoppingCart.init();

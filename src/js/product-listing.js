import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductList from "./ProductList.mjs";
import ExternalServices from "./ExternalServices.mjs";

const listElement = document.querySelector(".product-list");
const title = document.querySelector(".title");

//Loade Header and Footer
loadHeaderFooter();

const category = getParam("category");
title.textContent = category;

const dataSource = new ExternalServices();
const productList = new ProductList(category, dataSource, listElement);
productList.init();

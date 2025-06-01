import { loadHeaderFooter } from "./utils.mjs";

import { getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

//Loade Header and Footer
loadHeaderFooter();

const productId = getParam("product");
const dataSource = new ExternalServices();

const product = new ProductDetails(productId, dataSource);
product.init();

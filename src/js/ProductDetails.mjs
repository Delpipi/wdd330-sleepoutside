import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource){
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document.getElementById("addToCart")
  .addEventListener("click", this.addProductToCart.bind(this));
  }
  
  addProductToCart() {
    const cartItems = getLocalStorage("so-cart");
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
  document.querySelector(".product-detail h3").textContent = this.product.Brand.Name;
  document.querySelector(".product-detail h2").textContent = this.product.NameWithoutBrand;

  const productImage = document.querySelector(".product-detail img");
  productImage.src = this.product.Image;
  productImage.alt = this.product.Name;

    document.querySelector(".product-card__price").textContent = `$${this.product.ListPrice}`;
    document.querySelector(".product__color").textContent = `${this.product.Colors[0].ColorName}`;

  document.querySelector(".product__description").innerHTML = this.product.DescriptionHtmlSimple;
  }
}

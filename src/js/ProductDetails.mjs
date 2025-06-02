import { alertMessage, getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";
import Breadcumb from "./components/Breadcrumb.mjs";
import BreadCumbItem from "./components/BreadcrumbItem.mjs";


export default class ProductDetails {
  constructor(productId, dataSource){
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderBreadCumdList();
    this.renderProductDetails();
  
    document.getElementById("addToCart")
  .addEventListener("click", this.addProductToCart.bind(this));
  }

  renderBreadCumdList() {
    const breadcumb = new Breadcumb(".breadcrumb");
    breadcumb.addItem(new BreadCumbItem(this.product.Category, `/product_listing/?category=${this.product.Category}`));
    breadcumb.addItem(new BreadCumbItem(this.product.Name, null, true));
    breadcumb.renderItems();
  }
  
  addProductToCart() {
    const cartItems = getLocalStorage("so-cart");
    let index = cartItems.findIndex((product) => product.Id === this.product.Id);
    if (index !== -1) {
      this.product.quantity = this.product.quantity + 1;
      cartItems[index] = this.product;
    } else {
      this.product.quantity = 1;
      cartItems.push(this.product);
    }

    setLocalStorage("so-cart", cartItems);
    
    updateCartCount();
    alertMessage("item is successfully added");
  }

  renderProductDetails() {
    document.querySelector(".product-detail h3").textContent = this.product.Brand.Name;
    document.querySelector(".product-detail h2").textContent = this.product.NameWithoutBrand;

    const productImage = document.querySelector(".product-detail img");
    productImage.src = this.product.Images.PrimaryLarge;
    productImage.alt = this.product.Name;
    productImage.setAttribute("loading", "lazy");
  
    const productDiscount = 1 - (this.product.FinalPrice  / this.product.SuggestedRetailPrice);
  
    let productPriceText = `$${this.product.FinalPrice}`;
  
    if (productDiscount > 0) {
      document.querySelector(".product-card__srp").textContent = `SRP: $${this.product.SuggestedRetailPrice.toFixed(2)}`;
      productPriceText += `<span class="product-card__discount">-${Math.round(productDiscount * 100)}% off</span>`;
    }
  
    
    document.querySelector(".product-card__price").innerHTML = productPriceText;
    document.querySelector(".product__color").textContent = `${this.product.Colors[0].ColorName}`;

    document.querySelector(".product__description").innerHTML = this.product.DescriptionHtmlSimple;
  }
}

import { renderListWithTemplate } from "./utils.mjs";
import Breadcumb from "./components/Breadcrumb.mjs";
import BreadCumbItem from "./components/BreadcrumbItem.mjs";

function productCardTemplate(product) {
    const discounted = product.FinalPrice < product.SuggestedRetailPrice;
  let discount = 0;
  if (discounted) {
    discount = product.SuggestedRetailPrice - product.FinalPrice;
  }
  return `<li class="product-card">
   <div class="${discounted ? 'ruban-discount' : ''}" data-discount="${discount.toFixed(2)}"></div>
    <a href="../product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium }" alt="${product.Name}" loading="lazy">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
      const list = await this.dataSource.getData(this.category);
      this.renderBreadCumdList(list);
      this.renderList(list);
  }
  
  renderBreadCumdList(list) {
    const breadcumb = new Breadcumb(".breadcrumb");
    breadcumb.addItem(new BreadCumbItem(`${this.category} (${list.length} Items)`, null, true));
    breadcumb.renderItems();
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
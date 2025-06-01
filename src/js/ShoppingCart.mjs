import { getLocalStorage, setLocalStorage, updateCartCount,renderListWithTemplate, updateCartQtyInLocalStorage} from "./utils.mjs";
import Breadcumb from "./components/Breadcrumb.mjs";
import BreadCumbItem from "./components/BreadcrumbItem.mjs";

function cartItemTemplate(item) {
    const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Images.PrimaryMedium}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <div class="cart-card__quantity">
      <p>qty: <span id="qty-${item.Id}" >${item.quantity}</span></p>
      <div>
        <a role="button" href="#" class="qty-up" data-id="${item.Id},${item.FinalPrice}">
          <svg 
            height="30" 
            width="30" 
            fill=var(--tertiary-color)
            viewBox="0 0 48 48"  
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22h-8v8h-4v-8h-8v-4h8v-8h4v8h8v4z"/>
          </svg>
        </a>
        <a role="button"  href="#" class="qty-down" data-id="${item.Id},${item.FinalPrice}">
          <svg 
            height="30" 
            width="30" 
            fill=var(--light-grey)
            viewBox="0 0 48 48"  
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22H14v-4h20v4z"/>
          </svg>
        </a>
      </div>
    </div>
    <div class="cart-btn__remove">
      <a role="button" href="#" class="btn-remove" data-id="${item.Id}">
        <svg 
          width="30" 
          height="30"  
          fill="red"
          viewBox="0 0 256 256" 
          xmlns="http://www.w3.org/2000/svg" 
        >
          <path d="M137.051,128l75.475-75.475c2.5-2.5,2.5-6.551,0-9.051s-6.551-2.5-9.051,0L128,118.949L52.525,43.475  c-2.5-2.5-6.551-2.5-9.051,0s-2.5,6.551,0,9.051L118.949,128l-75.475,75.475c-2.5,2.5-2.5,6.551,0,9.051  c1.25,1.25,2.888,1.875,4.525,1.875s3.275-0.625,4.525-1.875L128,137.051l75.475,75.475c1.25,1.25,2.888,1.875,4.525,1.875  s3.275-0.625,4.525-1.875c2.5-2.5,2.5-6.551,0-9.051L137.051,128z"/>
        </svg>
      </a>
    </div>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
    return newItem;
}

export default class ShoppingCart{
  constructor(listElement) {
      this.listElement = listElement;
  }

  async init() {
    const list = getLocalStorage("so-cart") || [];
    this.renderBreadCumdList(list);
    this.renderCartContents(list);
    this.calculateTotal(list);
    if (list.length > 0) {
      this.increaseQuanity();
      this.decreaseQuanity();
      this.removeCard();
    }
 
  }

  calculateTotal(list) {
    const total = list.reduce((sum, product) => sum + (product.quantity * product.FinalPrice), 0);
    const totalContent = document.querySelector('.cart-total');
    const checkoutOrder = document.querySelector('.checkout-order');
    if (total > 0) {
      totalContent.innerHTML = `Total: $<span>${total.toFixed(2)}</span>`;
      checkoutOrder.style.display = "block";
    } else {
      totalContent.textContent = "The cart is empty";
      checkoutOrder.style.display = "none";
    }
    
  }

  renderCartContents(list) {
    renderListWithTemplate(cartItemTemplate, this.listElement, list);
  }

  rebuildRenderCartContents(list) {
    renderListWithTemplate(cartItemTemplate, this.listElement, list, undefined, true);
  }

  renderBreadCumdList(list) {
    const cartSize = list.reduce((sum, product) => sum + product.quantity, 0);
    const breadcumb = new Breadcumb(".breadcrumb");
    breadcumb.addItem(new BreadCumbItem(`cart(${cartSize} Items)`, null, true));
    breadcumb.renderItems();
  }
  
  increaseQuanity() {
    const buttons = document.querySelectorAll(".qty-up");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const data = event.currentTarget.getAttribute('data-id');
        const productId = data.split(",")[0];
        const productPrice = data.split(",")[1];

        const span = document.getElementById(`qty-${productId}`);
        const total = document.querySelector('.cart-total span');

        const oldQty = parseInt(span.textContent, 10);
        const currentTotal = parseFloat(total.textContent);
        const price = parseFloat(productPrice);

        let newQty = 0;
        if (oldQty >= 1) {
          newQty += 1;
          let sum = currentTotal + newQty * price;
          span.textContent = oldQty + newQty;
          total.textContent  = sum.toFixed(2);
        }

        updateCartQtyInLocalStorage(productId, parseInt(span.textContent));
        updateCartCount();
      });
    });
  }

  decreaseQuanity() {
    const buttons = document.querySelectorAll(".qty-down");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const data = event.currentTarget.getAttribute('data-id');
        const productId = data.split(",")[0];
        const productPrice = data.split(",")[1];

        const span = document.getElementById(`qty-${productId}`);
        const total = document.querySelector('.cart-total span');

        const oldQty = parseInt(span.textContent, 10);
        const currentTotal = parseFloat(total.textContent);
        const price = parseFloat(productPrice);
       
        let newQty = 0;
        if (oldQty > 1) {
          newQty += 1;
          let sum = currentTotal - (newQty * price);
          span.textContent = oldQty - newQty;
          total.textContent  = sum.toFixed(2);
        }

        updateCartQtyInLocalStorage(productId, parseInt(span.textContent));
        updateCartCount();
      });
    });
  }

  removeCard() {
    const buttons = document.querySelectorAll(".btn-remove");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = event.currentTarget.getAttribute('data-id');

        let list = getLocalStorage("so-cart") || [];
        list = list.filter((product) => product.Id !== productId);
        this.calculateTotal(list);

        setLocalStorage("so-cart", list);
        this.rebuildRenderCartContents(list);

        //cart number in  badge
        updateCartCount();

        //rebuild
        if (list.length > 0) {
          this.increaseQuanity();
          this.decreaseQuanity();
          this.removeCard();
        }
      });
    });
  }
  
}

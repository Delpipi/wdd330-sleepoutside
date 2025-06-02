import { alertMessage, getLocalStorage, removeAllAlerts, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import Breadcumb from "./components/Breadcrumb.mjs";
import BreadCumbItem from "./components/BreadcrumbItem.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: 1,
    };
  });
  return simplifiedItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) { 
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.renderBreadCumdList();
    this.calculateItemSummary();
    this.calculateOrderTotal();
  }

  renderBreadCumdList() {
    const breadcumb = new Breadcumb(".breadcrumb");
    breadcumb.addItem(new BreadCumbItem("cart", "/cart/index.html"));
    breadcumb.addItem(new BreadCumbItem("order", null, true));
    breadcumb.renderItems();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(this.outputSelector + " #cartTotal");
    const itemNumElement= document.querySelector(this.outputSelector + " #num-items");
    const itemElements = this.list.reduce((sum, item) => sum + item.quantity, 0);
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
    itemNumElement.textContent =  `${itemElements}`;
    summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = (this.itemTotal * 0.06);
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = (parseFloat(this.itemTotal) + parseFloat(this.tax) + parseFloat(this.shipping));
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const order = formDataToJSON(form);
    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    try {
      const response = await services.checkout(order);
      if (response) {
        this.clearCartContent();
        window.location.href = "success.html";
      }
    } catch (err) {
      removeAllAlerts();
      for (let message in err.messages) {
        alertMessage(err.messages[message]);
      }
      console.log(err);
    }
  }

  clearCartContent() {
    setLocalStorage("so-cart", []);
  }
}
// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(templateFn, parentELement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentELement.innerHTML = "";
  }
  parentELement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  const cart = getLocalStorage("so-cart") || [];
  if (countElement) {
    countElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }
}

export function updateCartQtyInLocalStorage(id, qty) {
  let cartItems = getLocalStorage("so-cart") || [];
  const itemIndex = cartItems.findIndex(item => item.Id == id);
  cartItems[itemIndex].quantity = qty;
  setLocalStorage("so-cart", cartItems);
}
  
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/hearder.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.getElementById('main-header');
  const footerElement = document.getElementById('main-footer');

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  updateCartCount();
}

export function renderWithTemplate(template, parentELement, data, callback) {
  parentELement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}
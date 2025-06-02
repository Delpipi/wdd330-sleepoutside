const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data
  } else {
    throw {name: 'serviceError', messages: data};
  }
}

export default class ExternalServices {
  constructor() {
    // this.category = category;
    // this.path = `../json/${this.category}.json`;
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);

    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  
  async checkout(payload) {

    let url = `${baseURL}checkout`;
    let h = new Headers();
    h.append("Content-Type", "application/json");
    
    const response = await fetch(url, {
      method: "POST",
      headers: h,
      body: JSON.stringify(payload),
    });

    const data = await convertToJson(response);
    return data.Result;

  }

}
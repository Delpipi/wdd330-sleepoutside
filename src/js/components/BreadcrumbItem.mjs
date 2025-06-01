export default class BreadCumbItem{
    constructor(text, link = null, isActive = false) {
        this.text = text;
        this.link = link;
        this.isActive = isActive;
    }

    render() {
        const text = this.text.charAt(0).toUpperCase() + this.text.slice(1);
        if (this.isActive) {
            return `<li class="breadcumb-item active">${text}</li>`;
        }
        return `<li><a href="${this.link}">${text}</a></li>`;
    }
}
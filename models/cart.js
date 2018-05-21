class Cart {
	constructor(oldCart) {
		console.log("Inside cart constructor");
		/*
			items is an object that contain products
			and is referenced by the product id
		*/
		this.items = oldCart.items || {};
		this.totalQty = oldCart.totalQty || 0;
		this.totalPrice = oldCart.totalPrice || 0;
	}

	addProductToCart(item, id) {
		var storedItem = this.items[id];

		//Create a new item if its not present in items list
		if (!storedItem) {
			storedItem = this.items[id] = { item: item, qty: 1, price: Number(item.price_1) };
		}

		//Increment qty by 1 and set price to item price
		storedItem.qty++;
		storedItem.price = item.price_1 * storedItem.qty;

		this.totalQty++;
		this.totalPrice += storedItem.item.price_1;

	}

	addProductToCart(item, id, quantity) {
		var storedItem = this.items[id];

		//Create a new item if its not present in items list
		if (!storedItem) {
			storedItem = this.items[id] = { item: item, qty: Number(quantity), price: Number(item.price_1) };
		}

		//Increment qty by 1 and set price to item price
		storedItem.qty += Number(quantity);
		storedItem.price = item.price_1 * storedItem.qty;

		this.totalQty += Number(quantity);
		this.totalPrice += (item.price_1 * quantity);

	}
	deleteProductfromCart(id, price_1) {
		console.log("in delete cart model");
		var storedItem = this.items[id];
		for (var i = 0; i < this.items.length; i++) {
			if ((this.items[i].item.id == id) && (this.items[i].item.price_1 == price_1)) {
				this.totalQty -= this.items[i].qty;
				this.totalPrice -= this.items[i].price ;

				this.items.splice(i, 1);
				break;
			}
		}

	}
	addOfferToCart(item, id, quantity, discount_price) {
		var storedItem = this.items[id];
		//Create a new item if its not present in items list
		storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
		//Increment qty by 1 and set price to item price
		console.log("Discount price", discount_price);
		storedItem.qty += Number(quantity);
		storedItem.price += Number(discount_price);
		console.log("Following Items in the List");
		this.totalQty += Number(quantity);
		this.totalPrice += Number(discount_price * quantity);

	}
	generateArray() {
		var arr = [];

		for (var id in this.items) {
			arr.push(this.items[id]);
		}

		return arr;
	}
}

module.exports = Cart;

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
		} else {
			//Increment qty by 1 and set price to item price
			storedItem.qty++;
			storedItem.price = item.price_1 * storedItem.qty;

		}
		this.totalQty++;
		this.totalPrice += storedItem.item.price_1;

	}

	addProductToCart(item, id, quantity) {
		var storedItem = this.items[id];

		//Create a new item if its not present in items list
		if (!storedItem) {
			storedItem = this.items[id] = { item: item, qty: Number(quantity), price: Number(item.price_1*quantity) };
		} else {
			//Increment qty by 1 and set price to item price
			storedItem.qty += Number(quantity);
			storedItem.price = storedItem.item.price_1  * storedItem.qty;

		}
		this.totalQty += Number(quantity);
		this.totalPrice += (item.price_1 * quantity);
	}
	addOfferToCart(item, id, quantity, discount_price) {
		var discount_priceD = item.price_1 - ((item.price_1 / 100) * discount_price)
		console.log("actual amount ", item.price_1, "Concession", discount_priceD);
		var storedItem = this.items[id + 100];
		//Create a new item if its not present in items list
		if (!storedItem) {
			item.id += 100;
			item.price_1 = discount_priceD
			storedItem = this.items[id + 100] = { item: item, qty: Number(quantity), price: Number(discount_priceD*quantity), type: "Offer" };
			console.log("Newly Stored Item")
		} else {
			storedItem.qty+= Number(quantity);
			storedItem.price = storedItem.item.price_1 * storedItem.qty;
		}
		//Increment qty by 1 and set price to item price
		this.totalQty += Number(quantity);
		this.totalPrice += discount_priceD * quantity;
	}

	//Object.assign([...this.state.editTarget], {[id]: {[target]: value}})

	deleteProductfromCart(id, price_1, cart) {

		var int_id = Number(id)
		var storedItem = this.items[id];
		console.log("in delete cart model cart.length", typeof (id), id);
		console.log(storedItem, "storedItem")
		if (storedItem) {
			this.totalQty -= Number(storedItem.qty);
			this.totalPrice -= storedItem.price;
			delete this.items[id];
		} else {
			console.log("in delete cart model cart data", cart);
		}
		console.log("Complete Cart", cart);
	}

	editProductfromCart(id, changeQty, cart) {

		var storedItem = this.items[id];
		var qty_decission = 0;
		console.log("in edit cart model ", typeof (id), id);
		console.log(storedItem, "storedItem")
		if (storedItem) { 
			this.totalQty -= storedItem.qty;
			this.totalPrice -= storedItem.item.price_1 * storedItem.qty;
			storedItem.qty = changeQty;
			storedItem.price = storedItem.item.price_1 * storedItem.qty;
			this.totalQty += storedItem.qty;
			this.totalPrice += storedItem.item.price_1 * storedItem.qty;
		} else {
			console.log("do nothig")
		}
		
		console.log("Complete Cart", cart);
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

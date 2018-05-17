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
			storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
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
			storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
		}

		//Increment qty by 1 and set price to item price
		storedItem.qty += Number(quantity);
		storedItem.price = item.price_1 * storedItem.qty;

		this.totalQty += Number(quantity);
		this.totalPrice += (item.price_1 * quantity);

	}
	addOfferToCart(item, id, quantity,discount_price) {
		var storedItem = this.items[id];
		//Create a new item if its not present in items list
			storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
		//Increment qty by 1 and set price to item price
		console.log("Discount price",discount_price);
		storedItem.qty += Number(quantity);
		storedItem.price += Number(discount_price);
		console.log("Following Items in the List");		
		this.totalQty += Number(quantity);
		this.totalPrice += Number(discount_price * quantity);
		// console.log("item data",item);
		// var stor
		// //Create a new item if its not present in items list
		// this.items[id] = { item: item, qty:0, price: parseFloat(discout_price) };
		// //Increment qty by 1 and set price to item price
		// this.items[id].qty = Number(quantity);
		// console.log("item qty",this.items[id].qty);
	
		// this.items[id].price = parseInt(result);
		// console.log("item price",this.items[id].price);
		// // storedItem.qty += Number(quantity);
		// // storedItem.price = item.price_1 * storedItem.qty;
		// this.totalQty = Number(quantity);
		// var result2 =number1 * number2
		// this.totalPrice = parseInt(result2);
		
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

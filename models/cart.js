var mySql = require('../config/database');
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
	addProductToCart(item, id, price) {
		var storedItem = this.items[id];
		//Create a new item if its not present in items list
		if (!storedItem) {
			item.price_1 = price;
			storedItem = this.items[id] = { item: item, qty: 1, price: Number(item.price_1) };
		} else {
			//Increment qty by 1 and set price to item price
			//	storedItem.qty++;
			//	storedItem.price = item.price_1 * storedItem.qty;
			throw 1;
		}
		this.totalQty++;
		this.totalPrice += (item.price_1 * quantity);
		throw 2;
	}

	addProductToCart(item, id, quantity, price) {
		var storedItem = this.items[id];
		//Create a new item if its not present in items list
		if (!storedItem) {
			item.price_1 = price;
			storedItem = this.items[id] = { item: item, qty: Number(quantity), price: Number(price * quantity) };
		} else {
			//Increment qty by 1 and set price to item price
			//storedItem.qty += Number(quantity);
			//storedItem.price = storedItem.item.price_1  * storedItem.qty;
			throw 1;
		}
		this.totalQty += Number(quantity);
		this.totalPrice += (price * quantity);
		throw 2;
	}// add offer to cart Working Fine
	// addOfferToCart(item, id, quantity, discount_price) {
	// 	var discount_priceD = item.price_1 - ((item.price_1 / 100) * discount_price)
	// 	console.log("actual amount ", item.price_1, "Concession", discount_priceD);
	// 	var storedItem = this.items[id + 100];
	// 	//Create a new item if its not present in items list
	// 	if (!storedItem) {
	// 		item.id += 100;
	// 		item.price_1 = discount_priceD
	// 		storedItem = this.items[id + 100] = { item: item, qty: Number(quantity), price: Number(discount_priceD*quantity), type: "Offer" };
	// 		console.log("Newly Stored Item")
	// 	} else {
	// 			storedItem.qty+= Number(quantity);
	// 			storedItem.price = storedItem.item.price_1 * storedItem.qty; 
	// 	}
	// 	//Increment qty by 1 and set price to item price
	// 	this.totalQty += Number(quantity);
	// 	this.totalPrice += discount_priceD * quantity;
	// }

	addOfferToCart(item, id, quantity, discount_price) {
		var discount_priceD = item.price_1 - ((item.price_1 / 100) * discount_price)
		console.log("actual amount ", item.price_1, "Concession", discount_priceD);
		var storedItem = this.items[id];
		//Create a new item if its not present in items list
		if (!storedItem) {
			//item.id += 100;
			item.price_1 = discount_priceD
			storedItem = this.items[id] = { item: item, qty: Number(quantity), price: Number(discount_priceD * quantity), type: "Offer" };
			console.log("Newly Stored Item")
		} else {
			throw 1;
		}
		//Increment qty by 1 and set price to item price
		this.totalQty += Number(quantity);
		this.totalPrice += discount_priceD * quantity;
		throw 2;
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

	getVatPrice() {
		return new Promise(function (resolve) {
			var rate = '" + rate + "';
			var query = `select setting from saidalia_js.gc_settings where id = 102`

			mySql.getConnection(function (err, connection) {
				if (err) {
					throw err;
				}
				connection.query(query, function (err, rows) {
					if (err) {
						throw err;
					}
					else {
						connection.release();
						console.log("Promise going to be resolved");
						resolve(rows[0]);
					}
				});
			});
		});
	}
	getFlatRate() {
		return new Promise(function (resolve) {
			var rate = '" + rate + "';
			var query = `select setting from saidalia_js.gc_settings where id = 95`

			mySql.getConnection(function (err, connection) {
				if (err) {
					throw err;
				}
				connection.query(query, function (err, rows) {
					if (err) {
						throw err;
					}
					else {
						connection.release();
						console.log("Promise going to be resolved");
						resolve(rows[0]);
					}
				});
			});
		});
	}
	getShippingRate() {
		return new Promise(function (resolve) {
			var rate = '" + rate + "';
			var query = `select setting from saidalia_js.gc_settings where id = 116`

			mySql.getConnection(function (err, connection) {
				if (err) {
					throw err;
				}
				connection.query(query, function (err, rows) {
					if (err) {
						throw err;
					}
					else {
						connection.release();
						console.log("Promise going to be resolved");
						resolve(rows[0]);
					}
				});
			});
		});
	}
	getCountryAndCityRate() {
		return new Promise(function (resolve) {
			var rate = '" + rate + "';
			var query = `select setting from saidalia_js.gc_settings where id = 116`
			var query = `select setting from saidalia_js.gc_settings where id = 116`

			mySql.getConnection(function (err, connection) {
				if (err) {
					throw err;
				}
				connection.query(query, function (err, rows) {
					if (err) {
						throw err;
					}
					else {
						connection.release();
						console.log("Promise going to be resolved");
						resolve(rows[0]);
					}
				});
			});
		});
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

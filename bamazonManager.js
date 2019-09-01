const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "bamazon"
});

var main_menu = {
  type: "list",
  name: "menu",
  choices: [
    "View Products for Sale",
    "View Low Inventory",
    "Add to Inventory",
    "Add New Product",
    "Exit"
  ],
  message: "Select an option: "
};

var products = [];
var low_inventory_products = [];
var productId = -1;
var quantityToAdd = 0;
var newProduct = {};

function getProducts(askIt) {
  connection.query("select * from products", function(error, results, fields) {
    if (error) throw error;
    products = results;

    var items = [];
    products.forEach(element => {
      if (element.stock_quantity > 0) {
        items.push({
          ID: element.item_id,
          Product: element.product_name,
          Price: "$" + element.price,
          Quantity: element.stock_quantity
        });
      }
      if (element.stock_quantity < 5) {
        low_inventory_products.push({
          ID: element.item_id,
          Product: element.product_name,
          Price: "$" + element.price,
          Quantity: element.stock_quantity
        });
      }
    });
    if (askIt) {
      ask({
        type: "list",
        name: "menu",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ],
        message: function() {
          console.log("Available products for sale:");
          console.table(items);
        }
      });
    }
  });
}

function viewLowInventory() {
  connection.query("select * from products where stock_quantity < 5", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;

    results.forEach(element => {
      if (!low_inventory_products.includes(element.product_name)) {
        low_inventory_products.push({
          ID: element.item_id,
          Product: element.product_name,
          Price: "$" + element.price,
          Quantity: element.stock_quantity
        });
      }
    });
    ask({
      type: "list",
      name: "menu",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ],
      message: function() {
        console.log("Low inventory products:");
        console.table(low_inventory_products);
      }
    });
  });
}

function addToInventory(id, count) {
  connection.query(
    "update products set stock_quantity = ? where item_id = ?",
    [count, id],
    function(error, results, fields) {
      if (error) throw error;
      console.log("Inventory added!");
      setTimeout(() => {
        getProducts(true);
      }, 1000);
    }
  );
}

function addNewProduct(product) {
  var sql =
    "insert into products(product_name, department_name, price, stock_quantity)\n";
  sql += "values(?, ?, ?, ?);";

  connection.query(
    sql,
    [product.name, product.department, product.price, product.inventory],
    function(error, results, fields) {
      if (error) throw error;
      console.log("Product added!");
      setTimeout(() => {
        getProducts(true);
      }, 1000);
    }
  );
}

function ask(question) {
  inquirer.prompt([question]).then(answers => {
    if (answers.menu) {
      switch (answers.menu) {
        case "View Products for Sale": {
          getProducts(true);
          break;
        }
        case "View Low Inventory": {
          viewLowInventory();
          break;
        }
        case "Add to Inventory": {
          if (low_inventory_products.length > 0) {
            ask({
              type: "input",
              name: "item_id",
              message: "Select product ID: "
            });
          } else {
            console.log("There are no low-inventory products!");
            setTimeout(() => {
              getProducts(true);
            }, 1000);
          }
          break;
        }
        case "Add New Product": {
          ask({
            type: "input",
            name: "product_name",
            message: "Enter product name: "
          });
          break;
        }
        default: {
          connection.end();
          console.log("Thank You!");
          setTimeout(() => {
            process.exit(-1);
          }, 1000);
          break;
        }
      }
    } else if (answers.item_id) {
      productId = parseInt(answers.item_id);
      ask({
        type: "input",
        name: "item_count",
        message: "Enter quantity number to add: "
      });
    } else if (answers.item_count) {
      quantityToAdd = parseInt(answers.item_count);
      // add inventory
      addToInventory(productId, quantityToAdd);
    } else if (answers.product_name) {
      newProduct.name = answers.product_name;
      ask({
        type: "input",
        name: "product_department",
        message: "Enter product department: "
      });
    } else if (answers.product_department) {
      newProduct.department = answers.product_department;
      ask({
        type: "input",
        name: "product_price",
        message: "Enter product price: "
      });
    } else if (answers.product_price) {
      newProduct.price = answers.product_price;
      ask({
        type: "input",
        name: "product_count",
        message: "Enter product inventory: "
      });
    } else if (answers.product_count) {
      newProduct.inventory = answers.product_count;
      addNewProduct(newProduct);
    }
  });
}

ask(main_menu);

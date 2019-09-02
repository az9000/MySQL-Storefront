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
  message: "\nSelect an option: \n"
};

var products = [];
var low_inventory_products = [];
var productId = -1;
var quantityToAdd = 0;
var newProduct = {};
var departments = [];

connection.connect(function(err){
  if (err) throw err;
  connection.query('select department_name from departments;', function(error, results) {
    if (error) throw error;

    results.forEach(element => {
      departments.push(element.department_name);
    });

  })
});

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
          console.clear();
          console.log("\nAvailable products for sale:");          
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
    low_inventory_products.length = 0;
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
        console.log("\nLow inventory products:");
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
      console.log("\nInventory added!\n");
      setTimeout(() => {
        getProducts(true);
      }, 500);
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
      console.log("\nProduct added!\n");
      setTimeout(() => {
        getProducts(true);
      }, 1000);
    }
  );
}

function ask(question) {
  inquirer.prompt([question]).then(answers => {
    //console.log(answers);
    if (answers.menu) {
      switch (answers.menu) {
        case "View Products for Sale": {
          console.clear();
          getProducts(true);
          break;
        }
        case "View Low Inventory": {
          console.clear();
          viewLowInventory();
          break;
        }
        case "Add to Inventory": {
          console.clear();
          if (low_inventory_products.length > 0) {
            ask({
              type: "input",
              name: "item_id",
              message: function() {
                console.table(low_inventory_products);
                "\nSelect product ID: "
              },
              validate: function(input) {
                if (!input) {
                  console.log('\ID must be a number!\nTry again!\n');
                } else if (!validateNumber(input)) {
                  console.log('\ID must be a number!\nTry again!\n');
                  return false;
                }
                return input !== '';
              }
            });
          } else {
            console.log("\nThere are no low-inventory products!\n");
            setTimeout(() => {
              getProducts(true);
            }, 500);
          }
          break;
        }
        case "Add New Product": {
          console.clear();
          ask({
            type: "input",
            name: "product_name",
            message: "\nEnter product name: ",
            validate: function(input) {              
              return input !== '';
            }
          });
          break;
        }
        default: {
          console.clear();
          connection.end();
          console.log("\nThank You!\n");
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
        message: "\nEnter quantity number to add: ",
        validate: function(input) {
          if (!input) {
            console.log('\Quantity must be a number!\nTry again!\n');
          } else if (!validateNumber(input)) {
            console.log('\Quantity must be a number!\nTry again!\n');
            return false;
          }
          return input !== '';
        }
      });
    } else if (answers.item_count) {
      quantityToAdd = parseInt(answers.item_count);
      // add inventory
      addToInventory(productId, quantityToAdd);
    } else if (answers.product_name) {
      newProduct.name = answers.product_name; 
      
      ask({
        type: "list",
        name: "product_department",
        choices: departments,
        message: "\nSelect product department: "
      });
    } else if (answers.product_department) {
      newProduct.department = answers.product_department;
      ask({
        type: "input",
        name: "product_price",
        message: "\nEnter product price: ",
        validate: function(input) {
          if (!input) {
            console.log('\nPrice must be a number!\nTry again!\n');
          }
          return input !== '';
        }
      });
    } else if (answers.product_price) {
      newProduct.price = answers.product_price;
      ask({
        type: "input",
        name: "product_count",
        message: "\nEnter product inventory: ",
        validate: function(input) {
          if (!input) {
            console.log('\Inventory must be a number!\nTry again!\n');
          } else if (!validateNumber(input)) {
            console.log('\Inventory must be a number!\nTry again!\n');
            return false;
          }
          return input !== '';
        }
      });
    } else if (answers.product_count) {
      newProduct.inventory = answers.product_count;
      addNewProduct(newProduct);
    }
  });
}

ask(main_menu);

function validateNumber(value) {
  if (!value) {
    return false;
  }
  if (value.length === 0) {
    return false;
  }
  for (var i = 0; i < value.length; i++) {
    if (isNaN(parseInt(value[i]))) {
      return false;
    }
  }

  return true;
}
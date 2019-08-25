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

var products = [];
var departments = [];

// connect to DB
connection.connect();

function closeConnection() {
  connection.end();
}

function getProducts() {
  connection.query("select * from products", function(error, results, fields) {
    if (error) throw error;
    products = results;

    var items = [];
    products.forEach(element => {
      if (element.stock_quantity > 0) {
        if (!items.includes(element.product_name)) {
          items.push({
            ID: element.item_id,
            Product: element.product_name,
            Price: "$" + element.price
          });
        }
      }
    });

    ask({
      type: "text",
      name: "ID",
      message: function() {
        console.log("Available products for sale:");
        console.table(items);
      }
    });
  });

  //closeConnection();
}

getProducts();

var productName = "";
var quantity = 1000;
var productId = -1;
var productCost = 1;
function ask(question) {
  inquirer.prompt([question]).then(answers => {
    if (answers.option) {
      if (answers.option === "Exit") {
        console.log();
        console.log("Thank You and Good Bye!");
        console.log();
        process.exit(-1);
      } else {
        getProducts();
      }
    } else if (answers.ID) {
      connection.query(
        `select * from products where item_id=?`,
        [answers.ID],
        function(error, results, fields) {
          if (error) throw error;
          productId = results[0].item_id;
          productCost = results[0].price;
          quantity = results[0].stock_quantity;
          productName = results[0].product_name;
          ask({
            type: "text",
            name: "item_quantity",
            message: "Enter quantity: "
          });
        }
      );
    } else if (answers.item_quantity) {
      var requested_quantity = parseInt(answers.item_quantity);
      if (requested_quantity > quantity) {
        ask({
          type: "text",
          name: "item_quantity_error",
          message: "Insufficient quantity!"
        });
        setTimeout(() => {
          closeConnection();
          process.exit(-1);
        }, 500);
      } else {
        // update the SQL database to reflect the remaining quantity
        var update_sql = `update products set stock_quantity=? where item_id=?;`;
        var current_quantity = quantity - requested_quantity;
        connection.query(update_sql, [current_quantity, productId], function(
          error,
          results,
          fields
        ) {
          if (error) throw error;
          // show the customer the total cost of their purchase.
          var total_cost = requested_quantity * productCost;
          console.table([
            {
              Product: productName,
              Quantity: requested_quantity,
              "Total Cost": "$" + total_cost.toFixed(2)
            }
          ]);
          // update product sales
          var sales = 0;
          products.forEach(element => {
            if (element.item_id === productId) {
              sales = element.product_sales + total_cost;
            }
          });
          update_sql = `update products set product_sales=? where item_id=?;`;
          connection.query(update_sql, [sales, productId], function(
            error,
            results,
            fields
          ) {
            console.log('Sold!');
            setTimeout(() => {
              ask({
                type: "list",
                name: "option",
                choices: ["Exit", "Continue"],
                message: "What would you like to do now? "
              });
            }, 500);
          });
        });
      }
    }
  });
}

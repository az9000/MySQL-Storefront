const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "bamazon",
  multipleStatements: true
});

var departments = [];
connection.connect(function(err) {
  if (err) throw err;
  var sql = `select d.department_name, p.department_name from departments d
  inner join products p
  on p.department_name=d.department_name;`;
  connection.query(sql, function(err, results) {
    var sales = 0;
    var dept_name = "";
    results.forEach(element => {
      if (departments.indexOf(element.department_name) < 0) {
        departments.push(element.department_name);
      }
    });
  });
});

var main_menu = {
  type: "list",
  name: "menu",
  choices: [
    "View Product Sales by Department",
    "Create New Department",
    "Exit"
  ],
  message: "Select an option: "
};
var departments = [];
function displaySales() {
  var sql = `select d.department_id, p.department_name, d.over_head_costs, floor(sum(p.product_sales)) as total_sales from products p
  inner join departments d
  on d.department_name=p.department_name
  group by department_name;`;
  connection.query(sql, function(error, results, fields) {
    if (error) throw error;

    var items = [];
    results.forEach(element => {
      items.push({
        department_id: element.department_id,
        department_name: element.department_name,
        department_name: element.department_name,
        over_head_costs: element.over_head_costs,
        product_sales: element.total_sales,
        total_profit:
          parseInt(element.total_sales) - parseInt(element.over_head_costs)
      });
    });

    ask({
      type: "list",
      name: "menu",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
        "Exit"
      ],
      message: function() {
        console.log("Departments: ");
        console.table(items);
      }
    });
  });
}

function ask(question) {
  inquirer.prompt([question]).then(answers => {
    if (answers.menu) {
      switch (answers.menu) {
        case "View Product Sales by Department": {
          displaySales();
          break;
        }
        case "Create New Department": {
          break;
        }
        default: {
          connection.end();
          console.log("Thank You!");
          setTimeout(() => {
            process.exit(-1);
          }, 1000);
          break;
          break;
        }
      }
    }
  });
}

ask(main_menu);

const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "bamazon",
  multipleStatements: true,
  debug: false
});

const main_menu = {
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
var departmentName = "";
var departmentCost = 0.0;

connection.connect(function(err) {
  if (err) throw err;

  getDepartments();
});

// get all departments
function getDepartments() {
  connection.query("select * from departments", function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    departments.length = 0;
    results.forEach(element => {
      departments.push({
        id: element.department_id,
        name: element.department_name
      });
    });
  });
}

function displaySales() {
  var sql = `select d.department_id, p.department_name, d.over_head_costs, floor(sum(p.product_sales)) as total_sales from products p
  right join departments d
  on d.department_name=p.department_name
  group by department_name order by department_id;`;
  connection.query('call new_procedure();', function(error, results, fields) {
    if (error) throw error;
    var items = [];
    results[0].forEach(element => {
      var total_sales = element.total_sales;
      var department_name = element.department_name;

      if (!element.department_name) {
        for (var key in departments) {
          if (departments[key].id === element.department_id) {
            department_name = departments[key].name;
          }
        }
        total_sales = 0.0;
      }

      items.push({
        department_id: element.department_id,
        department_name: department_name,
        over_head_costs: element.over_head_costs,
        product_sales: total_sales,
        total_profit: parseInt(total_sales) - parseInt(element.over_head_costs)
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

function ask(question) {
  inquirer.prompt([question]).then(answers => {
    if (answers.menu) {
      switch (answers.menu) {
        case "View Product Sales by Department": {
          displaySales();
          break;
        }
        case "Create New Department": {
          // I need a name
          ask({
            type: "input",
            name: "new_department_name",
            message: "Enter new department name: ",
            validate: function(input) {
              return input !== "";
            }
          });
          break;
        }
        case "Exit": {
          connection.destroy();
          console.log("Thank You!");
          setTimeout(() => {
            process.exit(-1);
          }, 1000);
          break;
        }
      }
    } else if (answers.new_department_name) {
      var isValid = true;
      departments.forEach(dept => {
        if (dept.name.toLowerCase() === answers.new_department_name) {
          isValid = false;
        }
      });
      if (isValid) {
        departmentName = answers.new_department_name;
        ask({
          type: "input",
          name: "over_head_costs",
          message: "Enter the new department's over head costs:$",
          validate: function(input) {
            return input !== "";
          }
        });
      } else {
        console.log(
          `Department '${answers.new_department_name}' already exists!!\nTry again!`
        );
        ask({
          type: "input",
          name: "new_department_name",
          message: "Enter new department name: ",
          validate: function(input) {
            return input !== "";
          }
        });
      }
    } else if (answers.over_head_costs) {
      var isValid = validateNumber(answers.over_head_costs);
      if (!isValid) {
        console.log("Cost should be a number!\nTry again!");
        ask({
          type: "input",
          name: "over_head_costs",
          message: "Enter the new department's over head costs:$",
          validate: function(input) {
            return input !== "";
          }
        });
      }
      departmentCost = answers.over_head_costs;

      var sql = `insert into departments(department_name, over_head_costs) values('${departmentName}','${departmentCost}');`;
      connection.query(sql, function(err, results) {
        if (err) throw err;
        console.log(departmentName, "was Added!");
        getDepartments();
        setTimeout(() => {
          ask(main_menu);
        }, 100);
      });
    }
  });
}

ask(main_menu);

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
    "View Product Sales by Department",
    "Create New Department",
    "Exit"
  ],
  message: "Select an option: "
};

function ask(question) {
    inquirer.prompt([
        question
    ]).then(answers => {

    });
}
# MySQL-Storefront

An Amazon-like storefront using node JS and MySQL. The app will take in orders from customers and deplete stock from the store's inventory. The app will also track product sales across the store's departments and then provide a summary of the highest-grossing departments in the store.
<br>

## Objective

The app utilizes the CLI terminal for user interaction. There are 3 separate node JS files, each dedicated to a particular user type. There's a Customer View file (bamazonCustomer.js), a Manager View file (bamazonManager.js), and a Supervisor View file (bamazonSupervisor.js).
<br>

## Structure

1. **bamazonCustomer.js** - this file is used by the Customer to view available products for sale, and will allow the Customer to order a specific product and the number of units of the product they wish to buy.
   <br>
1. **bamazonManager.js** - this file is used by the Manager to view available products for sale, view products with low inventory, add to the inventory, as well as add new products.
   <br>
1. **bamazonSupervisor.js** - this file is used by the Supervisor to view product sales by departments, as well the ability to add new departments.
   <br>

## How to use

1. Clone, or download this repository <br>
1. Install dependencies <br>
   `$ npm install` <br>
1. Edit example.env file <br>
1. Enter User's MySQL database username and password<br>
1. Rename example.env to .env <br>
1. Run the App <br>

- Customer View: <br>
  `$ node bamazonCustomer.js` <br>
- Manager View: <br>
  `$ node bamazonManager.js` <br>
- Supervisor View: <br>
  `$ node bamazoneSupervisor.js` <br>

<br>
## Demo
Click on the link below to view a demonstration of the use of the App <br>
[Video link](https://drive.google.com/file/d/1I0BbyozAWvJ5ytq9jsqmCA42HOo-_Iuw/view)
<br>

## Repository
[GitHub]https://github.com/az9000/MySQL-Storefront
<br>

## Technologies used

- node v10.15.3
- npm v6.4.1
- dotenv v8.0.0
- inquirer v7.0.0
- mysql v2.17.1
- console.table v0.10.0

## Author
Fawzi Alami

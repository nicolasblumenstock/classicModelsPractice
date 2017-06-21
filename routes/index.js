var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config')
var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

connection.connect();


/* GET home page. */
router.get('/', function(req, res, next) {
	var openQuery = 'SELECT productLine FROM productLines';
	connection.query(openQuery,(error,results)=>{
		// console.log(results);
		res.render('index', {
			title: 'Cars 2 is a bad movie',
			someArray: results
			});
	});
router.get('/:productLine', (req,res)=>{
	var product = req.params.productLine;
	var productQuery = 'SELECT productName,textDescription FROM products INNER JOIN productlines ON products.productLine = productlines.productLine WHERE productlines.productLine = ?' ;
	connection.query(productQuery,[product],(error, results)=>{
		res.render('products', {
			title: product,
			someArray: results
		})
	})
});
router.get('/products/:code', (req,res)=>{
	var product = req.params.code;
	var productQuery = 'SELECT * FROM products INNER JOIN orderdetails ON orderdetails.productCode = products.productCode WHERE productName = ?'
	connection.query(productQuery,[product],(err,firstRes)=>{
		var queryOne = firstRes;
		var productCode = firstRes[0].productCode;
		var totalQuery = 'select COUNT(*) as freebird,SUM(quantityOrdered) as tacos from orderdetails where productCode = ? group by productCode';
		connection.query(totalQuery,[productCode],(error, ham)=>{
			res.render('productname',{
				title: product,
				queryOne: queryOne,
				total: ham
			});
		});
	});
	});
router.get('/order/:orderNum', (req,res)=>{
	var orderNumber = req.params.orderNum;
	var bigQuery = 'select products.productName,customers.customerNumber,customers.customerName,customers.city as custCity,employees.firstName,employees.lastName,employees.reportsTo,offices.city as officeCity,orders.status,orderdetails.quantityOrdered,orderdetails.priceEach from products inner join orderdetails on orderdetails.productCode = products.productCode inner join orders on orders.orderNumber = orderdetails.orderNumber inner join customers on customers.customerNumber = orders.customerNumber inner join employees on employees.employeeNumber = customers.salesRepEmployeeNumber inner join offices on offices.officeCode = employees.officeCode where orderdetails.orderNumber = ?';
	connection.query(bigQuery,[orderNumber], (error,results)=>{
		var queryTwo = results;
		var employerQuery = 'select firstName,lastName from employees where employeeNumber = ?'
		var employer = results[0].reportsTo;
		connection.query(employerQuery,[employer],(err,lochResMonster)=>{
			var Ressie = lochResMonster;
			res.render('orders',{
				title: orderNumber,
				queryTwo: queryTwo,
				employer: Ressie
			})
		})
	})
})
});

module.exports = router;

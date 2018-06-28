var mysql = require( 'mysql' );
var inquirer = require( 'inquirer' );

var connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
} )

connection.connect( function ( err ) {
    if ( err ) throw err;
    selection();
} );

var display = function () {
    connection.query( 'SELECT * FROM Products', function ( err, res ) {
        for ( var i = 0; i < res.length; i++ ) {
            console.log( "Item ID: " + res[i].item_ID + "\nProduct: " + res[i].product_name + " --- Department: " + res[i].department_name + " --- Price: " + res[i].price + " --- Stock: " + res[i].stock_quantity );
            console.log( "---------------------------------------------------------------------" );
        }
        selection();

    } );
};

var selection = function () {
    inquirer.prompt( [{
        name: "choice",
        type: "list",
        message: "What would you like to do? ",
        choices: ["view inventory", "view low inventory", "add inventory", "new product", "quit"],
        validate: function ( value ) {
            if ( isNaN( value ) === false ) {
                return true;
            }
            return false;

        }


    }] ).then( function ( response ) {
        console.log( response.choice );

        if ( response.choice == "view inventory" ) {
            display();


        }

        if ( response.choice == "view low inventory" ) {
            connection.query( "Select * FROM products WHERE stock_quantity < " + 5, function ( err, res ) {
                for ( var i = 0; i < res.length; i++ ) {
                    console.log( 'Item ID: ' + res[i].item_ID + ' ---Product Name: ' + res[i].product_name + ' ---Department: ' + res[i].department_name + ' ---Quantity: ' + res[i].stock_quantity );
                }
                selection();
            } );

        }

        if ( response.choice == "add inventory" ) {
            inquirer.prompt( [
                {
                    type: 'input',
                    name: 'item',
                    message: 'Please enter the Item ID to add inventory:'
                },
                {
                    type: 'input',
                    name: 'number',
                    message: 'Number of items to add: '
                }
            ] ).then( function ( response ) {
                var itemNumber = parseInt( response.item );

                connection.query( 'SELECT * FROM products WHERE ?', { item_ID: itemNumber }, function ( err, data ) {
                    if ( err ) throw err;
                    var numberAdd = parseInt( response.number );
                    console.log( data[0].product_name + " stock has been updated" )
                    console.log( "New" + data[0].product_name + " stock: " + data[0].stock_quantity );
                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + ( data[0].stock_quantity + numberAdd ) + ' WHERE item_ID = ' + itemNumber;

                    connection.query( updateQueryStr, function ( err, data ) {

                        if ( err ) throw err;
                        console.log( data.product_name + " stock has been updated" )
                        selection();
                    } );
                } )
            } )
        }
        if ( response.choice == "new product" ) {

        }
        if ( response.choice == "quit" ) {
            connection.end();
        }


    } );
};


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
    display();
} )

var display = function () {

    connection.query( 'SELECT * FROM Products', function ( err, res ) {
        for ( var i = 0; i < res.length; i++ ) {
            console.log( "Item ID: " + res[i].item_ID + "\nProduct: " + res[i].product_name + " --- Department: " + res[i].department_name + " --- Price: " + res[i].price + " --- Stock: " + res[i].stock_quantity );
            console.log( "---------------------------------------------------------------------" );
        }
        selection();
    } )
};
var selection = function () {
    inquirer.prompt( [{
        name: "item_ID",
        type: "input",
        message: "Please enter product ID for product you want.",
        validate: function ( value ) {
            if ( isNaN( value ) === false ) {
                return true;
            }
            return false;
        }
    }, {
        name: "units",
        type: "input",
        message: "How many units do you want?",
        validate: function ( value ) {
            if ( isNaN( value ) === false ) {
                return true;
            }
            return false
        }
    }] ).then( function ( response ) {
        connection.query( 'SELECT * FROM Products', { item_ID: response.item_ID }, function ( err, data ) {
            if ( err ) throw err;
            else {
                var item = response.item_ID - 1;
                var item_data = data[item];
                console.log( item_data.product_name );
                console.log("Stock Quantity: "+ item_data.stock_quantity);
                console.log("Order Quantity: "+ response.units);

                if (response.units> item_data.stock_quantity){
                    console.log( "---------------------------------------------------------------------" );
                    console.log("We do not have that many units available.");
                    console.log( "---------------------------------------------------------------------" );
                    selection();
                }
                else{
                    console.log("Total Price: "+ response.units * item_data.price + " USD");
                
            var new_quantity = item_data.stock_quantity - response.units;
            // connects to the mysql database products and updates the stock quantity for the item puchased
            connection.query("UPDATE products SET stock_quantity = " + new_quantity +" WHERE Item_ID = " + response.item_ID, function(err, res){

                connection.end();

        } );
                }
            

    }

        });


    } );
};


const Table = require('cli-table3');

// https://www.npmjs.com/package/cli-table3
// https://github.com/cli-table/cli-table3/blob/master/basic-usage.md


function displayTable(rows) {
    // Handle when no results are found in the queries - i.e. when queries are good, but return 0 rows
    if (rows.length === 0) {
        console.log('No results found.');
        return;
    }

    // Initialise table
    const table = new Table({
            // Set column headers based on the keys for a row of results - all rows have the same strucutre, so using first row for all is fine
        head: rows[0] ? Object.keys(rows[0]) : [], // Use the keys from the first row as headers if they exist, using ternery
        style: {
            head: ['cyan'], // Set the header color to cyan
        },
        // Copied from https://www.npmjs.com/package/cli-table3#custom-styles
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' 
        },
    });

    // For each row of data get the corresponding data/property for each header key, create an array with it and push it to the table
    rows.forEach(row => {
        const rowData = Object.values(row);
        table.push(rowData);
    });

    // print the table in the console by converting the data to a string
    console.log(table.toString());
}

module.exports = displayTable;
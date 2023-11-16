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
    const table = new Table();

    // Set column headers based on the keys for a row of results - all rows have the same strucutre, so using first row for all is fine
    const columnHeaders = Object.keys(rows[0]);

    // Push the headers to the table
    table.push(columnHeaders);

    // For each row of data get the corresponding data/property for each header key, create an array with it and push it to the table
    rows.forEach(row => {
        const rowData = columnHeaders.map(header => row[header]);
        table.push(rowData);
    });

    // print the table in the console by converting the data to a string
    console.log(table.toString());
}

module.exports = displayTable;
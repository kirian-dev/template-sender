"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function generateCSV(rows) {
    var header = 'first_name,last_name,email\n';
    var csvData = header;
    for (var i = 1; i <= rows; i++) {
        var firstName = "Test_".concat(i);
        var lastName = "Test_".concat(i);
        var email = "test_email_".concat(i, "@tests.com");
        csvData += "".concat(firstName, ",").concat(lastName, ",").concat(email, "\n");
    }
    return csvData;
}
function saveCSVToFile(rows) {
    var csvData = generateCSV(rows);
    var filePath = './public/uploads/test_accounts.csv';
    fs.writeFileSync(filePath, csvData, 'utf-8');
    console.log("CSV file with ".concat(rows, " rows has been created: ").concat(filePath));
}
var numberOfRows = parseInt(process.argv[2], 10) || 10;
saveCSVToFile(numberOfRows);

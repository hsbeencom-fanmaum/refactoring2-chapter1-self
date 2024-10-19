const fs = require("fs");
const { statement, htmlStatement } = require("./statement");

const plays = JSON.parse(fs.readFileSync("./plays.json"));
const invoices = JSON.parse(fs.readFileSync("./invoices.json"));

invoices.map((invoice) => console.log(statement(invoice, plays)));
invoices.map((invoice) => console.log(htmlStatement(invoice, plays)));

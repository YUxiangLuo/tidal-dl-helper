const fs = require("fs");
let list = fs.readFileSync("download-list.txt").toString("utf-8").split("\n");
list = list.map(item => item.trim()).filter(item => item);
console.log(list);
module.exports = list;
let { remote } = require("electron");
// console.log(process.versions.electron);

const { PosPrinter } = remote.require("electron-pos-printer");
// const {PosPrinter} = require("electron-pos-printer"); //dont work in production (??)

const path = require("path");

let webContents = remote.getCurrentWebContents();
let printers = webContents.getPrinters();

printers.map((item, index) => {
  document.getElementById("list_printers").innerHTML +=
    '<label for="printer_' +
    index +
    '">' +
    item.name +
    "</label><br>";
});
const { app, BrowserWindow } = require('electron')
const { PosPrinter } = require("electron-pos-printer");

var url = require('url');
const path = require("path");
const PORT = 8080
const PRINTER_NAME = "XP-58"

app.on("ready", function () {
    var mainWindow = new BrowserWindow({
        icon: __dirname + '/site-icon.png',
        show: true,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
    });
    mainWindow.loadURL("file://" + __dirname + "/app.html");
    mainWindow.webContents.openDevTools()
    mainWindow.webContents.once("did-finish-load", function () {
        var http = require("http");
        var server = http.createServer(function (req, res, params) {
            try {
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Max-Age': 2592000,
                    'Content-Type': 'application/json'
                });
                var q = url.parse(req.url, true).query;
                console.log(q);
                print(q.user_id, q.prize_name, q.reference_id)
                res.write('{"success":true}');
                res.end(``);

            } catch (error) {
                res.write('{"success":false}');
                res.end(``);
            }
        });
        server.listen(PORT);
        console.log("http://localhost:" + PORT);
    });
});
function print(user_id, prize_name, reference_id) {

    let widthPage = "200px";
    let margin = "0 0 50px -20px";
    const data = [
        {
            type: "image",
            path: path.join(__dirname, "assets/logo.png"), // file path
            position: "center", // position of image: 'left' | 'center' | 'right'
            width: "180px", // width of image in px; default: auto
            height: "167px", // width of image in px; default: 50 or '50px'
        },
        {
            type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value:
                "PATRON ID<br>",
            css: {
                "font-size": "13px",
                "font-family": "Metropolis Black",
                "text-align": "center",
            },
        },
        {
            type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value:
                user_id + "<br><br>",
            css: {
                "font-size": "13px",
                "font-family": "Metropolis SemiBold",
                "text-align": "center",
            },
        },
        {
            type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value:
                "PRIZE",
            css: {
                "font-size": "13px",
                "font-family": "Metropolis Black",
                "text-align": "center",
            },
        },
        {
            type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value:
                prize_name + "<br><br>",
            css: {
                "font-size": "13px",
                "font-family": "Metropolis SemiBold",
                "text-align": "center",
            },
        },
        {
            type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value:
                "REFERENCE NO.",
            css: {
                "font-size": "13px",
                "font-family": "Metropolis Black",
                "text-align": "center",
            },
        },
        {
            type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value:
                reference_id + "<br><br>",
            css: {
                "font-size": "13px",
                "font-family": "Metropolis SemiBold",
                "text-align": "center",
            },
        },
        {
            type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
            value: "-----------------------------------",
            style: `text-align:center;`,
            css: {
                "font-size": "13px",
                "font-family": "Metropolis Black",
                "text-align": "center",
            }
        },
    ];
    const options = {
        preview: false,
        width: widthPage,
        margin: margin,
        copies: 1,
        printerName: PRINTER_NAME,
        timeOutPerLine: 400,
        silent: true,
    };
    const now = {
        type: "text",
        value: "" + date(),
        style: `text-align:center;`,
        css: { "font-size": "12px", "font-family": "sans-serif" },
    };
    const d = [...data, now];
    if (1) {
        PosPrinter.print(d, options)
            .then(() => { })
            .catch((error) => {
                console.error(error);
            });
    } else {
        alert("Select the printer and the width");
    }
}
function date() {
    const x = new Date();
    const y = "0" + x.getHours();
    const z = "0" + x.getMinutes();
    const s = "0" + x.getSeconds();
    const h = "0" + x.getDate();
    const ano = x.getFullYear().toString().substr(-2);
    const ms = x.getMonth();
    const meses = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];
    return (
        y.substr(-2) +
        ":" +
        z.substr(-2) +
        ":" +
        s.substr(-2) +
        " -  " +
        h.substr(-2) +
        "/" +
        meses[ms]
    );
}

const http = require('http');
const url = require('url');
/*
const express = require('express');
const app = express();
app.use("/list", function (request, response) {

    response.send("<h1>list</h1>");
});
app.listen(5000);
*/
http.createServer(function (req, res) {
    let urlParts = url.parse(req.url);
    console.log(urlParts);
    //console.log(urlParts.pathname);
    if (req.method == 'GET') {
        if (urlParts.pathname === '/') {
            homepage(req, res);
        }
        if (/\A\/list\b\/\d/.test(urlParts.pathname)) {
            list(req, res, urlParts);
        }
        if (/\/list\b/.test(urlParts.pathname)) {
            list(req, res, urlParts);
        } else {
            page404(req, res);
        }
        /*
        switch (urlParts.pathname) {
            case "/":
                homepage(req, res);
                break;
            case "/list":
            case "/list/":
                list(req, res, urlParts);
                break;
            default:
                page404(req, res);
                break;
        }
        */
    }
    else if (req.method == 'POST') {
        switch (urlParts.pathname) {
            case "/save":
                createitem(req, res);
                break;
            default:
                page404(req, res);
                break;
        }
    }
    else {
        page404(req, res);
    }

}).listen(3000);
console.log("Start");

function homepage(req, res) {
    res.end("homepage");
}
function list(req, res, urlParts) {
    let arr = ['text for page 1', 'text for page 2', 'text for page 3', 'text for page 4', 'text for page 5'];
    let datasend = {};
    let query = {};
    let page = 0;
    let pageSize = 1;
    let totalpage = arr.length;
    if (urlParts.query) {
        urlParts.query.split('&')
            .forEach((one) => {
                let part = one.split('=');
                if (part.length === 2 && part[1] !== '') {
                    return (query[part[0]] = part[1])
                }
            });
    }
    if (query && query.page) {
        page = parseInt(query.page, 10);
        if (!(page >= 0)) {
            page = 0;
        }
        if ((page >= totalpage)) {
            page = totalpage - 1;
        }
    }
    if (query && query.pageSize) {
        pageSize = parseInt(query.pageSize, 10);
        if (!(pageSize > 0)) {
            pageSize = 1;
        }
        if (pageSize > Math.ceil(totalpage / (page + 1))) {
            pageSize = 1;
        }
    }
    query.pageSize = pageSize;
    query.page = page;
    datasend.text = (arr.slice(page, (page + 1) * pageSize));
    datasend.settings = query;
    datasend.settings.totalpage = totalpage;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(datasend));
    //res.end();
}
function createitem(req, res) {
    res.end("created");
}
function page404(req, res) {
    res.end("404");
}
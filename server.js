const http = require('http');
const url = require('url');

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

let arr = ['text for page 1', 'text for page 2', 'text for page 3', 'text for page 4', 'text for page 5', 'text for page 6', 'text for page 7', 'text for page 8', 'text for page 8', 'text for page 10', 'text for page 11', 'text for page 12'];

function homepage(req, res) {
    res.end("homepage");
}

function list(req, res, urlParts) {
    let datasend = {};
    let query = {};
    let currentPage = 0;
    let pageSize = 1;
    let totalPage = arr.length;
    if (urlParts.query) {
        query = parseQuery(urlParts.query);
    }
    if (query && query.page) {
        currentPage = testPageNumber(query.page, totalPage);
    }
    if (query && query.pageSize) {
        pageSize = testPageSize(query.pageSize, totalPage, currentPage);
    }
    query.pageSize = pageSize;
    query.page = currentPage;
    datasend.text = (arr.slice(currentPage, (currentPage + 1) * pageSize));
    datasend.settings = query;
    datasend.settings.totalPage = totalPage;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(datasend));
    //res.end();
}

function testPageNumber(queryPage, totalPage) {
    let localPage = parseInt(queryPage, 10);
    if (!(localPage >= 0)) {
        localPage = 0;
    }
    if ((localPage >= totalPage)) {
        localPage = totalPage - 1;
    }
    return localPage;
}

function testPageSize(queryPageSize, totalPage, currentPage) {
    let localPageSize = parseInt(queryPageSize, 10);
    if (!(localPageSize > 0)) {
        localPageSize = 1;
    }
    if (localPageSize > Math.ceil(totalPage / (currentPage + 1))) {
        localPageSize = 1;
    }
    return localPageSize;
}

function parseQuery(stringquery) {
    let resultquery = {};
    stringquery.split('&')
        .forEach((one) => {
            let part = one.split('=');
            if (part.length === 2 && part[1] !== '') {
                return (resultquery[part[0]] = part[1])
            }
        });
    return resultquery;
}

function createitem(req, res) {
    res.end("created");
}

function page404(req, res) {
    res.end("404");
}
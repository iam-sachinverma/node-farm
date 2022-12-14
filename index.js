const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceElement = require('./modules/replaceElement')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((req, res) => {

    const { pathname, query } = url.parse(req.url, true);

    // OVERVIEW
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHTML = dataObj.map(el => replaceElement(tempCard, el)).join('');

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);

        res.end(output);
    }
    // PRODUCT PAGE
    else if (pathname === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];

        const output = replaceElement(tempProduct, product);
        res.end(output);
    }
    // API
    else if (pathname === '/api'){
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    } 
    // NOT FOUND
    else{
        res.writeHead(404, {
            'Content-type' : 'text/html'
        })
        res.end(`<h1> Page Not Found </h1>`)
    }
})

server.listen(8000, 'localhost', () => {
    console.log('Listening to request on port 8000......')
})
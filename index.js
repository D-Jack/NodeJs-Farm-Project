const fs=require('fs');
const url=require('url');

////////////////////////////
// FILES

// const textIn=fs.readFileSync('./txt/input.txt','utf-8');

// console.log(textIn);

// const textOut=`This is we know about avocado : \n${textIn}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File Written!');

// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             const out=`${data2}\n${data3}`;
//             fs.writeFile('./txt/final.txt',out,'utf-8',(err)=>{
//                 if(err)
//                     console.log(err);
//                 else 
//                     console.log('File Written');
//             });
//         }); 
//     });
// });


////////////////////////////
// SERVER

const replaceTemplate= (temp,product)=>{
    let output=temp.replace(/{%PRODUCT_NAME%}/g,product.productName);
    output=output.replace(/{%PRODUCT_IMAGE%}/g,product.image);
    output=output.replace(/{%PRODUCT_ID%}/g,product.id);
    output=output.replace(/{%PRODUCT_QUANTITY%}/g,product.quantity);
    output=output.replace(/{%PRODUCT_PRICE%}/g,product.price);
    output=output.replace(/{%PRODUCT_NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%PRODUCT_DESCRIPTION%}/g,product.description);
    output=output.replace(/{%PRODUCT_FROM%}/g,product.from);
    if(!product.organic){
        output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }
    return output;

    
}
const http=require('http');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);


const server=http.createServer((req,res)=>{
    const {query,pathname}=url.parse(req.url,true);
    if(pathname==='/' || pathname==='/overview'){
        
        const cardHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('\n');
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);
        res.writeHead(200,{'Content-type':'text/html'});
        res.end(output);
    }
    else if(pathname==='/product'){
        res.writeHead(200,{'Content-type':'text/html'});
        const product=dataObj[Number(query.id)];
        const output=replaceTemplate(tempProduct,product);
        res.end(output);
    }
    else {
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'Hello world'
        });
        res.end('Page Not Found--');
    }
    
    // res.end('Hello from the server');
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('lISTENING TO THE SERVER AT PORT 8000 .....');
});
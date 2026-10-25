console.log("hi express starting now!!");

const express = require("express")
const app = express()   // app is an object that calls express 1st  

const path = require('path')        // 2nd importance

app.use(express.static(path.join(__dirname, "public"))) // MIDDLEWARE   can call the css, html files and static files in general    
// public folder is called directly so files in it are called directly
//  NOW YOU CAN ACCESS PUBLIC FILES IN BROWSER : localhost:3100/style.css  will infact work
app.get('/', (req, res) => {
    res.send("hello world")
})
app.get('/nti', (req, res) => {     // arguments are (request , response)   using get method
    res.send("<h1>hello nti!</h1>")
})


app.get('/about',(req,res)=>{       // '/about' is what im writting in html request on browser
    res.sendFile(path.join(__dirname, '/contacts.html'))
})

// here are only 3 requests / the root , /nti and /about only these are answered when used with GET
//  however if i request anything else like contacts.html or index.js we only get 
//  Cannot GET /index.js    AS AN EXAMPLE



const port = 3100       // must be in last spot
app.listen(port, ()=>{
    console.log(`listening on port: ${port}`);
});

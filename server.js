const Razorpay = require("razorpay");
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const cors=require('cors')
const cookieParser =require( 'cookie-parser')
require('./db/mongoose')
const userRouter = require('./src/Router/userRouter')
const middleware=require('./middleware/index')

const app = express();

app.use(cors())

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.listen(8080, () => console.log("Listening on port 8080"));

const config = require("./config");

const instance = new Razorpay({
  key_id: config.RAZORPAY_KEY,
  key_secret: config.RAZORPAY_SECRET,
});



const publicDirectoryPath = path.join(__dirname, '/public')
const viewsPath = path.join(__dirname, '/templates/views')
//  use when index.html is a static page 
app.use(express.static(path.join(publicDirectoryPath)))

// //Setup handlebars engine and view location
app.set('view engine', 'hbs');
app.set('views', viewsPath)


// app.use('/signup',express.static(path.join(publicDirectoryPath,'/signup.html')))
// app.use('/chat',express.static(path.join(publicDirectoryPath,'/chat.html')))
// app.use('/navBar',express.static(path.join(publicDirectoryPath,'/navBar.html')))

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

const task = async () => {
  const amount = 5000;
  const currency = "INR";

  try {
    // const response = await instance.orders.create({ amount, currency })
    const paymentLink = await instance.invoices.create({
      type: "link",
      amount: 6500,
      description: "Dhaba payment",
      callback_url:'http://localhost:8080/api/payment/redirect',
      callback_method:'get'
    });
    console.log(paymentLink);
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/payment/redirect", (req, res, next) => {
  console.log(req.query)
  res.redirect('http://localhost:3000/payorder')
});


app.post('/api/pay',async (req,res)=>{

  const { amount } = req.body;

  console.log(amount)

  const currency = "INR";
  try {
    const paymentLink = await instance.invoices.create({
      type: "link",
      amount: amount*100,
      description: "Restaurant Payment",
      callback_url:'http://localhost:8080/api/payment/redirect',
      callback_method:'get'
    });

    res.send({paymentLink:paymentLink.short_url})

  } catch (error) {
    console.log(error);
  }

})

app.get('/signup',(req, res) => {
  res.render('signup')
})

app.get('/login',(req,res)=>{
  res.render('login')
})

// app.get('/home',middleware.authorisedUser(),(req, res) => {

//   res.render('room')
// })



app.get('/logout',middleware.authorisedUser(),(req, res) => {
 res.clearCookie('jwtToken')
 res.redirect('/login')
 
})

app.use('/v',userRouter)


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});





//task();

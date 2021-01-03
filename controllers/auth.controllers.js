const config = require('../conf')
const Jwt = require('jsonwebtoken')


const axios = require('axios')
const Bcrypt = require('bcrypt')
const User = require('../src/model/index')

/*******************/
/** CONFIGURATION **/
/*******************/




/*************/
/** HELPERS **/
/*************/





function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope
  });
}




//promise return 

//promise abhi resolve async await 
async function getTokenFromCode(code) {

  try {
    const auth = createConnection();
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    return { result: true, data: tokens }
  }
  catch (e) {
    return { result: false, data: e }
  }

}



async function loginLocal(req, res, next) {
  const { email, password } = req.body
  

  try {
    const savedUser = await User.findOne({ email });
    if (!savedUser) {
      res.send({ result: false, data: "email not found" })
      return;
    }
    const result = await Bcrypt.compare(password, savedUser.hashPassword);
    if (result) {
      req.user = savedUser;
      res.send('<script>alert("Sign in successful") </script>  <script> window .location="/home"</script>')

    }
    else {
      res.send({ result: false, data: "Wrong  password" })
    }
  } catch (e) {
    
    res.status(400).send({ result: false, data: e })
  }
}
async function SignUpHandler(req, res, next) {
  const { email, password, name } = req.body;
  let fetchUser = await User.findOne({ email: email });
  if (fetchUser) {
    res.send('<script>alert("Already signed up!! Please Login") </script>  <script> window .location="/login"</script>')
  }

  const hashPassword = Bcrypt.hashSync(password, parseInt(config.brctyptSalt));

  const user = new User({ email, hashPassword, name, source: 'local' })
  try {
    const savedUser = await user.save();
    req.user = savedUser;
    next();
  }
  catch (e) { res.status(400).send({ result: false, error: e }) }

}




async function getUser(req, res, next) {
  const { cookies } = req;
  const { jwtToken } = cookies
  try {

    if (jwtToken) {

      const data = Jwt.verify(jwtToken, config.JWT_KEY)
      if (data) {
      
        let fetchUser = await User.findOne(data.userId);
        res.send(fetchUser)
      }

    } else {
      return res.status(400).send({ status: false, data: "user is not logged in" })
    }

  } catch (error) {
    return res.status(200).send({ status: false, data: error })
  }

}







module.exports = {

  SignUpHandler,
  loginLocal,
  getUser

}
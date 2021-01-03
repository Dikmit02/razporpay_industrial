const JWT = require('jsonwebtoken')
const config = require('../conf')
const User = require('../src/model/index')

function assignJWT(req, res, next) {
    const { user } = req
   
    const jwtToken = JWT.sign({ userId: user._id }, config.JWT_KEY);
    res.cookie('jwtToken', jwtToken, { httpOnly: true })
    res.send('<script> window .location="https://localhost:3000/product"</script>')
}


async function authorisedUser(req, res, next) {
    const jwtToken = req.cookies.jwtToken
    if (!jwtToken) {
        res.redirect('/login')
        return;
    }
    try {
        const data = JWT.verify(jwtToken, config.JWT_KEY)
        if (data) {
            let user = await User.findOne({ _id: data.userId });
            next()
        }
    } catch{
        res.send('<script>alert("Something Went Wrong Login again") </script>  <script> window .location="/login"</script>')
    }
}
module.exports = {
    assignJWT,
    authorisedUser
}
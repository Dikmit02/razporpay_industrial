const authMiddleWare=require('./authMiddleWare')

function assignJWTMiddleware(){
    return authMiddleWare.assignJWT
}
function authorisedUser(){
    return authMiddleWare.authorisedUser
}

module.exports={
    assignJWTMiddleware,
    authorisedUser
}
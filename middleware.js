const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
try{
	let token = req.header('x-token')
	if(!token){
	   return res.status(400).send('Token not Found')
	}
	let decode = jwt.verify(token,'jwtsecret')
	req.user = decode.user
	next();
}catch(err){
	console.log(err.message)
	return res.status(500).send("Invalid Token")
}
}
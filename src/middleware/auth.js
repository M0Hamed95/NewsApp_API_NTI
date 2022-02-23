// require jsonwebtoken
const jwt = require('jsonwebtoken');

// require Reporter
const Reporter = require('../models/reporter');

// Create Authentication Function
const auth = async (req, res, next) => {
  try {
    // GET token
    const token = req.header('Authorization').replace('Bearer ', '');
    // decode token --> return: _id, iat
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    // GET reporter by _id
    const reporter = await Reporter.findOne({
      _id: decode._id,
      tokens: token,
    });
    if (!reporter) {
      throw new Error();
    }
    // send reporter && token in variables named: "req.reporter" -- "req.token"
    req.reporter = reporter;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication Vaild, Please Try Again' });
  }
};
const Admin = async (req, res, next) => {
    if (req.author.roles !== 'admin') {
        return res.status(401).send({
            error: 'You are not admin.'
        })
    }
    next()
}
// export auth
module.exports = {
    auth,
    Admin
}

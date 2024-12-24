const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const ensureAuthorization = (req) => {
    try{
        const receivedJwt = req.headers["authorization"];
        console.log(receivedJwt);

        if(receivedJwt){
            const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            console.log(decodedJwt);
            return decodedJwt;
        } else {
            throw new ReferenceError("jwt is not defined");
        }
    } catch(err) {
        console.log(err.name);
        console.log(err.message);
        return err;
    }
}

module.exports = ensureAuthorization;
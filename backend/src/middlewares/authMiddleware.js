const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: 'Token não fornecido.'});
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme != 'Bearer' || !token) {
        return res.status(401).json({error: 'Formato de token inválido. Use Bearer <token>.'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }catch(error){
        return res.status(401).json({error: 'Token inválido ou expirado'});
    }
}

module.exports = authMiddleware;
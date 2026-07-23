const jwt = require('jsonwebtoken');

function autoMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: 'Token não fornecido.'});
    }

    cosnt [scheme, token] = authHeader.split('  ');

    if (scheme != 'Bearer' || !token) {
        return res.status(401).json({error: 'Formato de token inválido. Use Bearer <token>.'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.id;
        next();
    }catch(error){
        return res.status(401).json({error: 'Token inválido ou expirado'});
    }
}

module.exports = authMiddleware;
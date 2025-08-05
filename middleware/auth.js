import jwt from 'jsonwebtoken';

export default function auth(req, res, next){
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token) res.status(401).json({msg: 'No Token Provided'});
    try{
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded.user;
        next();
    }catch(e){
        res.status(401).json({msg: 'Invalid Token'});
    }
}
import jwt from 'jsonwebtoken'

export function IdentifyUser(req, res, next) {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"Unauthorised",
            success:false,
            err:"Token not provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded

        next()
    } catch (err) {
        return res.status(401).json({
            message:"Unauthorised",
            success:false,
            err:"Token not provided"
        });
    }
}
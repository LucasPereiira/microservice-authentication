import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import Jwt from "jsonwebtoken";
import basicAuthenticationMiddlewares from "../middlewares/basic-authentication.middlewares";
import bearerAuthenticationMiddleware from "../middlewares/bearer-authentication.middleware";
import ForbiddenError from "../models/Errors/forbbiden.error.model";

const authorizarionRouter = Router();

authorizarionRouter.post('/token/validate', bearerAuthenticationMiddleware, (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

authorizarionRouter.post('/token', basicAuthenticationMiddlewares, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        //Para garantia se alguém retirar o basicAuthenticationMiddlewares
        if (!user) {
            throw new ForbiddenError('Usuário não informado!');
        }

        const jwtPayload = { username: user.username }
        const jwtOptions = { subject: user?.uuid }
        const secretKey = 'my_secret_key'

        const jwt = Jwt.sign(jwtPayload, secretKey, jwtOptions);
        res.status(StatusCodes.OK).json({ token: jwt });

    } catch (error) {
        next(error)
    }
});

/*Alguns tipos do token
"iss" O domínio da aplicação geradora do token
"sub" É o assunto do token, mas é muito utilizado para guardar o id do usuário
"aud" Define quem pode usar o token
"exp" Data para expiração do token
"nbf" Define uma data para qual o token não pode ser aceito antes dela
"iat" Data de criação do token
"jti" O id do token*/

export default authorizarionRouter;
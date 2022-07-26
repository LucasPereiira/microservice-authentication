import { NextFunction, Request, Response, Router } from "express"; //Permite configurações de rotas
import { StatusCodes } from "http-status-codes"; //Pacote para usar o statuscode (npm install --save http-status-codes)
import bearerAuthenticationMiddleware from "../middlewares/bearer-authentication.middleware";
import userRepository from '../repositories/user.repository';

const usersRoute = Router();

usersRoute.get('/users', bearerAuthenticationMiddleware, async (req: Request, resp: Response, next: NextFunction) => {
    //const users = [{ userName: "Lucas" }]; mock
    const users = await userRepository.findAllusers();
    resp.status(StatusCodes.OK).send(users);
});

//:uuid --> Diz que esse id será uma variável
usersRoute.get('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
        const uuid = req.params.uuid;
        const user = await userRepository.findById(uuid);
        res.status(StatusCodes.OK).send(user);
    } catch (error) {
        next(error);
    }
});

usersRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;

    const uuid = await userRepository.create(newUser);
    console.log(req.body);
    res.status(StatusCodes.CREATED).send(uuid);
});

usersRoute.put('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    const modifedUser = req.body;

    modifedUser.uuid = uuid;

    await userRepository.update(modifedUser);

    res.status(StatusCodes.OK).send();
});

usersRoute.delete('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    //const uuid = req.params.uuid;
    await userRepository.remove(req.params.uuid);
    res.sendStatus(StatusCodes.OK);
});

usersRoute.get('/users')

export default usersRoute;
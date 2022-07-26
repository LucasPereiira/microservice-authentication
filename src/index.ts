
import express from 'express'; //serve para gerenciar rotas http
import errorHandler from './middlewares/error-handler.middlewares';
import authorizarionRouter from './routes/authorization.routes';
import statusRoute from './routes/status.route';
import usersRoute from './routes/user.route';

const app = express();
//Para a aplicação entender o json
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//quando chegar a requisição get no /status, ele realiza essa função
app.use(statusRoute);

//Importa as rotas criadas no user.route
app.use(usersRoute);



app.use(authorizarionRouter);

//configuração dos Handlers de erro
app.use(errorHandler);

//escutar a porta 3000 e toda requisição que chegar nela, irá executar a função de cima.
app.listen(3000, () => {
    console.log("Hello Word!");
});

//alt+shif+f = formatar arquivo
//ALT+shif+o = formata os imports
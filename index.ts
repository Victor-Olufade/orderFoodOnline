import express from 'express';
import App from './services/ExpressApp';
import { dataBaseConnect } from './services/Database';

const startServer = async () => {
    const app = express();
    dataBaseConnect();
    await App(app);
}

startServer();
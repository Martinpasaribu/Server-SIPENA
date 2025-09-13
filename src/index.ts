import dotenv from 'dotenv';
import session from 'express-session';
import { connectToMongoDB } from './config/db_monggo_config';

import app from './app';
// import { sendTemplateMessage } from './utils/Whatsapp';
import { sendTelegramMessage } from './utils/Telegram';

dotenv.config();

const PORT = process.env.PORT || 5000;


const startServer = async () => {
    try {
        
        // await connectToDatabase();

        await connectToMongoDB()
        console.log('Server Read Database');
        
        app.listen(process.env.PORT, () => {
            console.log(`Server Active on Port ${process.env.PORT}`);
        });

        // await sendTemplateMessage()


    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); 
    }
};

startServer.keepAliveTimeout = 60000; // 60 detik
startServer.headersTimeout = 65000; 

startServer();
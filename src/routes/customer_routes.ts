import express from 'express';
import { CustomerControllers } from '../controllers/customer';

const CustomerRoutes: express.Router = express.Router();

CustomerRoutes.post('/', CustomerControllers.CreateCustomer);
CustomerRoutes.get('/', CustomerControllers.getCustomer);

export default CustomerRoutes;



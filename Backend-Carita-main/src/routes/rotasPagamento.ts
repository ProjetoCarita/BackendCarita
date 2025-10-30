import { Router } from 'express';
import {PaymentController} from '../controllers/controllerPagamento';

const router = Router();

router.post('/create-preference', PaymentController.createPreference);
router.get('/payment/:payment_id', PaymentController.getPayment);
router.post('/notification', PaymentController.notification); // Webhook

export default router;


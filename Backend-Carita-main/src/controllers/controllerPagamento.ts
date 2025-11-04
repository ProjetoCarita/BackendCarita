import { Request, Response } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-6593185265195698-092220-a627aef90d0648d1e95f98b92ad74270-2708636050'
});

export class PaymentController {
    static async createPreference(req: Request, res: Response): Promise<void> {
        try {
            console.log('🔄 Criando preferência de pagamento');
            
            const { title, price, description } = req.body;
            
            if (!title || !price) {
                res.status(400).json({ error: 'Title e price são obrigatórios' });
                return;
            }

            const preference = new Preference(client);
            
            const preferenceData = {
                items: [
                    {
                        id: 'item-' + Date.now(),
                        title: title,
                        unit_price: Number(price),
                        quantity: 1,
                        currency_id: 'BRL',
                        description: description || ''
                    }
                ],
                back_urls: {
                    success: 'https://six-rockets-melt.loca.lt/payment/success/',
                    failure: 'https://six-rockets-melt.loca.lt/payment/failure/',
                    pending: 'https://six-rockets-melt.loca.lt/payment/pending/',
                },
                auto_return: 'approved',
                notification_url: 'https://six-rockets-melt.loca.lt/api/payments/notification' // Opcional para webhooks
            };

            console.log(preferenceData)
            const result = await preference.create({ body: preferenceData });
            
            console.log('✅ Preferência criada com ID:', result.id);

            res.json({ 
                success: true,
                id: result.id,
                init_point: result.init_point,
                sandbox_init_point: result.sandbox_init_point
            });

        } catch (error: any) {
            console.error('❌ Erro ao criar preferência:', error.message);
            res.status(500).json({ 
                error: 'Erro ao criar preferência',
                details: error.message 
            });
        }
    }

    static async getPayment(req: Request, res: Response): Promise<void> {
        try {
            const { payment_id } = req.params;
            // Aqui você pode integrar com o Mercado Pago para buscar status do pagamento
            res.json({ 
                payment_id,
                status: 'pending', // Exemplo
                message: 'Payment details'
            });
        } catch (error) {
            console.error('❌ Error in getPayment:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Webhook para notificações do Mercado Pago
    static async notification(req: Request, res: Response): Promise<void> {
        try {
            const { type, data } = req.body;
            console.log('📩 Webhook recebido:', type, data);
            
            if (type === 'payment') {
                // Aqui você processa a notificação de pagamento
                console.log('💳 Pagamento atualizado:', data.id);
            }
            
            res.status(200).send('OK');
        } catch (error) {
            console.error('❌ Erro no webhook:', error);
            res.status(500).json({ error: 'Erro no webhook' });
        }
    }
}
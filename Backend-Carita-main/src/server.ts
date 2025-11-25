import express from 'express';
import cors from 'cors';
import comentariosroutes from "./routes/comentarios.routes"
import organizacaoRoutes from "./routes/organizacao.routes";
import parceiroRoutes from "./routes/parceiro.routes"
import pontoArrecadacaoRoutes from "./routes/pontoArrecadacao.routes"
import usuarioRoutes from "./routes/usuario.routers"
import { authRouter } from "./routes/auth.routes";
import { AuthorizeMiddleware } from './middlewares/authorize.middleware';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { initSocket, broadcastBanner, broadcastMetrics } from './realtime/socket';
import paymentRoutes from './routes/rotasPagamento';
import eventosRoutes from "./routes/eventos.routes"
dotenv.config();

const app = express();
import swaggerUi from 'swagger-ui-express';
const swaggerFile = require('../swagger-output.json');

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(cors({ origin: "*" }));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ==== MÉTRICAS EM MEMÓRIA ====
let familiasAjudadas = 0;

// Endpoint para atualizar métricas
app.post('/admin/metrics/familias', (req, res) => {
  const { delta, total } = req.body as { delta?: number; total?: number };
  if (typeof total === 'number') familiasAjudadas = Math.max(0, total);
  if (typeof delta === 'number') familiasAjudadas = Math.max(0, familiasAjudadas + delta);

  broadcastMetrics({ familiasAjudadas });
  res.json({ ok: true, familiasAjudadas });
});

app.use("/organizacoes",  organizacaoRoutes);
app.use("/parceiros",AuthorizeMiddleware,parceiroRoutes)
app.use("/pontosArrecadacao",pontoArrecadacaoRoutes)
app.use("/usuarios",usuarioRoutes)
app.use("/autenticacao", authRouter)
app.use("/comentario",  comentariosroutes)
app.use("/eventos", eventosRoutes);


// Endpoint para disparar um banner público
app.post('/admin/helper/banner', (req, res) => {
  const { message } = req.body as { message: string };
  if (!message) {
    res.status(400).json({ error: 'message é obrigatório' });
    return;
  }
  broadcastBanner(message);
  res.json({ ok: true });
});

// Endpoint para obter métricas
app.get('/public/metrics', (req, res) => {
  res.json({ familiasAjudadas });
});

// SUAS ROTAS PRINCIPAIS
app.use("/organizacoes", AuthorizeMiddleware, organizacaoRoutes);
app.use("/parceiros", AuthorizeMiddleware, parceiroRoutes);
app.use("/pontosArrecadacao", AuthorizeMiddleware, pontoArrecadacaoRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/autenticacao", authRouter);

// Rota de teste - SEMPRE funciona
app.get('/api/hello', (req, res) => {
    console.log('✅ Rota /api/hello chamada!');
    res.json({ message: 'FINALLY WORKING WITH TYPESCRIPT!', success: true });
});

// Rota de pagamento teste direta
app.post('/api/payments/direct-test', (req, res) => {
    console.log('✅ Direct payment route called:', req.body);
    res.json({ 
        id: 'direct-pref-' + Date.now(),
        message: 'Direct payment route working!',
        data: req.body
    });
});

// ROTAS DE PAGAMENTO
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3000;
const server = initSocket(app);
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📧 Rotas de pagamento disponíveis em: http://localhost:${PORT}/api/payments`);
});
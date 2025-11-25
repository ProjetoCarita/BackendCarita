import { Request, Response, Router } from "express";
import express from "express";
import { create, listAll, update, getById, desativar } from "../controllers/usuario.controller";
import { AuthorizeMiddleware } from "../middlewares/authorize.middleware";
import bcrypt from "bcrypt";
import { UsuarioModel } from "../models/usuario.model";
import { Op } from "sequelize";

const router = express.Router();

/**
 * @swagger
 * /:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - Usuario
 *     responses:
 *       200:
 *         description: Resposta bem-sucedida
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = req.body;


     usuario.role = "user";

    console.log(usuario)



    const existente = await UsuarioModel.findOne({
      where: {
        [Op.or]: [
          { email: usuario.email },
          { cpf: usuario.cpf }
        ]
      }
    });

    if (existente) {
      const duplicado = existente.email === usuario.email ? "E-mail" : "CPF";
      res.status(400).json({ message: `${duplicado} já cadastrado.` });
      return;
    }

    const senhaHash = await bcrypt.hash(usuario.senha, 10);
    usuario.senha = senhaHash;

    const novoUsuario = await create(usuario);
    const { senha, status, id, ...usuarioPublico } = novoUsuario;

    res.status(201).json(usuarioPublico);
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});



router.get("/dashboard-data",AuthorizeMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // Conta usuários ativos e inativos
    const usuariosAtivos = await UsuarioModel.count({ where: { status: true } });
    const usuariosInativos = await UsuarioModel.count({ where: { status: false } });

    const data = {
      labels: ["Ativos", "Inativos"],
      datasets: [
        {
          label: "Usuários",
          data: [usuariosAtivos, usuariosInativos],
        },
      ],
    };

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao gerar dados do dashboard:", error);
    res.status(500).json({ message: "Erro ao gerar dados do dashboard." });
  }
});




// router.use(AuthorizeMiddleware);


/**
 * @swagger
 * /:id:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     tags:
 *       - Usuario
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso
 */
router.get("/:id", AuthorizeMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const usuario = await getById(id);

    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
});


/**
 * @swagger
 * /:id:
 *   put:
 *     summary: Atualiza dados de um usuário
 *     tags:
 *       - Usuario
 *     responses:
 *       200:
 *         description: Atualização bem-sucedida
 */
router.put("/:id", AuthorizeMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await update(Number(id), req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
});


/**
 * @swagger
 * /:id/desativar:
 *   post:
 *     summary: Desativa um usuário
 *     tags:
 *       - Usuario
 *     responses:
 *       200:
 *         description: Usuário desativado com sucesso
 */
router.post("/:id/desativar", AuthorizeMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const desativado = await desativar(id);

    if (!desativado) {
      res.status(404).json({ message: "Usuário não encontrado ou já desativado." });
      return;
    }

    res.status(200).json({ message: "Conta desativada com sucesso." });
  } catch (error) {
    console.error("Erro ao desativar usuário:", error);
    res.status(500).json({ message: "Erro ao desativar usuário." });
  }
});


/**
 * @swagger
 * /:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Usuario
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
router.get("/", AuthorizeMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await listAll();
    res.status(200).json({ usuarios });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ message: "Erro ao listar usuários." });
  }
});


/**
 * @swagger
 * /dashboard-data:
 *   get:
 *     summary: Retorna dados estatísticos para o dashboard (gráfico)
 *     tags:
 *       - Usuario
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 */
router.get("/dashboard-data", async (req: Request, res: Response): Promise<void> => {
  try {
    // Conta usuários ativos e inativos
    const usuariosAtivos = await UsuarioModel.count({ where: { status: true } });
    const usuariosInativos = await UsuarioModel.count({ where: { status: false } });

    const data = {
      labels: ["Ativos", "Inativos"],
      datasets: [
        {
          label: "Usuários",
          data: [usuariosAtivos, usuariosInativos],
        },
      ],
    };

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao gerar dados do dashboard:", error);
    res.status(500).json({ message: "Erro ao gerar dados do dashboard." });
  }
});


export default router;


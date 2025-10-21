import { Request, Response } from "express";
import express from "express";
import { create, listAll, getById, update, remove } from "../controllers/comentarios.controller";
import { AuthorizeMiddleware } from "../middlewares/authorize.middleware";

const router = express.Router();

/**
 * @swagger
 * /comentario:
 *   post:
 *     summary: Cria um novo comentário
 *     tags:
 *       - Comentário
 */
router.post("/", AuthorizeMiddleware, async (req: Request, res: Response) => {
  try {
    const comentario = await create(req.body);
    res.status(201).json(comentario);
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    res.status(500).json({ message: "Erro ao criar comentário" });
  }
});

/**
 * @swagger
 * /comentario:
 *   get:
 *     summary: Lista todos os comentários
 *     tags:
 *       - Comentário
 */
router.get("/", async (req: Request, res: Response) => {
  const comentarios = await listAll();
  res.json(comentarios);
});

/**
 * @swagger
 * /comentario/{id}:
 *   get:
 *     summary: Busca comentário por ID
 *     tags:
 *       - Comentário
 */
router.get("/:id", async (req: Request, res: Response) => {
  const comentario = await getById(Number(req.params.id));
  if (!comentario)  res.status(404).json({ message: "Comentário não encontrado" });
  res.json(comentario);
});

/**
 * @swagger
 * /comentario/{id}:
 *   put:
 *     summary: Atualiza um comentário
 *     tags:
 *       - Comentário
 */
router.put("/:id", AuthorizeMiddleware, async (req: Request, res: Response) => {
  const atualizado = await update(Number(req.params.id), req.body);
  if (!atualizado) res.status(404).json({ message: "Comentário não encontrado" });
  res.json(atualizado);
});

/**
 * @swagger
 * /comentario/{id}:
 *   delete:
 *     summary: Exclui um comentário
 *     tags:
 *       - Comentário
 */
router.delete("/:id", AuthorizeMiddleware, async (req: Request, res: Response) => {
  const removido = await remove(Number(req.params.id));
  if (!removido)  res.status(404).json({ message: "Comentário não encontrado" });
  res.json({ message: "Comentário excluído com sucesso" });
});

export default router;

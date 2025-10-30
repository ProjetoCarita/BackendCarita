import { ComentariosModel } from "../models/comentarios.model";

export const create = async (data: any) => {
  // Aqui o id_usuario já deve estar no body
  if (!data.id_usuario) {
    throw new Error("id_usuario é obrigatório");
  }
  return await ComentariosModel.create(data);
};

export const listAll = async () => {
  return await ComentariosModel.findAll({
    include: [{ association: "usuario", attributes: ["id_usuario", "nome", "email"] }],
  });
};

export const getById = async (id: number) => {
  return await ComentariosModel.findByPk(id, {
    include: [{ association: "usuario", attributes: ["id_usuario", "nome", "email"] }],
  });
};

export const getByUsuarioId = async (id_usuario: number) => {
  return await ComentariosModel.findAll({
    where: { id_usuario },
    include: [{ association: "usuario", attributes: ["id_usuario", "nome", "email"] }],
  });
};

export const update = async (id: number, data: any) => {
  const comentario = await ComentariosModel.findByPk(id);
  if (!comentario) return null;
  await comentario.update(data);
  return comentario;
};

export const remove = async (id: number) => {
  const comentario = await ComentariosModel.findByPk(id);
  if (!comentario) return null;
  await comentario.destroy();
  return true;
};

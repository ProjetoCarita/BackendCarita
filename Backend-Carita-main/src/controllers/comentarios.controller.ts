import { ComentarioModel } from "../models/comentarios.model";

export const create = async (data: any) => await ComentarioModel.create(data);
export const listAll = async () => await ComentarioModel.findAll();
export const getById = async (id: number) => await ComentarioModel.findByPk(id);
export const update = async (id: number, data: any) => {
  const comentario = await ComentarioModel.findByPk(id);
  if (!comentario) return null;
  await comentario.update(data);
  return comentario;
};
export const remove = async (id: number) => {
  const comentario = await ComentarioModel.findByPk(id);
  if (!comentario) return null;
  await comentario.destroy();
  return true;
};
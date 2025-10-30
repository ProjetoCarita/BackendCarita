
export interface Comentarios {
  id_comentario: number;
  mensagem: string;

  //isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  id_usuario: number;
}

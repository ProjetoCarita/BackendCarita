import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { UsuarioModel } from "./usuario.model";

import { Comentarios } from "../interfaces/comentarios.interface";

type ComentariosCreationalAttributes = Optional<Comentarios, "id_comentario">

export class ComentariosModel extends Model<Comentarios, ComentariosCreationalAttributes> {
public id_comentario!: number;
public mensagem!: string;
public createdAt!: Date;
public id_usuario!: number;
} 

ComentariosModel.init({
  id_comentario: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mensagem: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  
  createdAt: { 
    type: DataTypes.DATE, 
    allowNull: false,
    field: 'createdAt',
    
  },
   updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
  },
    id_usuario: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'usuario', 
    key: 'id_usuario', 
  },
  field: 'id_usuario', 
}

},


{
  sequelize,
  tableName: "Comentarios",
  modelName: 'Comentarios',
  timestamps: true
}
);

ComentariosModel.belongsTo(UsuarioModel, {
  foreignKey: "id_usuario",
  as: "usuario", //  esse nome precisa bater com o include no controller
});
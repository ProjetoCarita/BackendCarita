import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

import { Comentarios } from "../interfaces/comentarios.interface";

type ComentarioCreationalAttributes = Optional<Comentarios, "id_comentario">

export class ComentarioModel extends Model<Comentarios, ComentarioCreationalAttributes> {
public id_comentario!: number;
public mensagem!: string;
public idUsuario!: number;
public createdAt!: Date;
} 

ComentarioModel.init({
  id_comentario: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  mensagem: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  idUsuario: { 
    type: DataTypes.INTEGER, 
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

},

{
  sequelize,
  tableName: "comentario",
  timestamps: true
});
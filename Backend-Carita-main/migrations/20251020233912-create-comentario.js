'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {

async up(queryInterface, Sequelize) {
await queryInterface.createTable('Comentarios', {
id_comentario: { 
  type: Sequelize.INTEGER, 
  autoIncrement: true, 
  primaryKey: true 
},
userId: {
type: Sequelize.INTEGER,
allowNull: false,
references: { model: 'usuario', key: 'id_usuario' },
onUpdate: 'CASCADE',
onDelete: 'CASCADE',
},
message: { type: Sequelize.TEXT, allowNull: false },
//isApproved: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
});
},
async down(queryInterface) {
await queryInterface.dropTable('Comantarios');
},
};
'use strict';

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("usuario", [
      {
        id_usuario: "1",
        email: "projetocaritavotorantim@gmail.com",
        cpf: "00000000000",
        senha: bcrypt.hashSync("ca123ri45ta", 10),
        role: "admin",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuario", { email: "projetocaritavotorantim@gmail.com" }, {});
  }
};
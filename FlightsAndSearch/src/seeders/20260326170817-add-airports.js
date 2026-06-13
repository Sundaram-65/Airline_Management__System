'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Airports',[

      {
          name:'Kempegowda International Airport',
          cityId:3,
          createdAt:new Date(),
          updatedAt:new Date()
      },
      {
        name:'Raja Bhoj Airport',
        cityId:3,
        createdAt:new Date(),
        updatedAt:new Date()
      },
      {
        name:"Devi Ahilya Bai Holkar Airport",
        cityId:9,
        createdAt:new Date(),
        updatedAt:new Date()
      },
      {
        name:'Rajmata Vijaya Raje Scindia Air Terminal',
        cityId:2,
        createdAt:new Date(),
        updatedAt:new Date()
      },
      // {
      //   name:'Sri Guru Ram Dass Jee International Airport',
      //   cityId:4,
      //   createdAt:new Date(),
      //   updatedAt:new Date()
      // }

    ],{})


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

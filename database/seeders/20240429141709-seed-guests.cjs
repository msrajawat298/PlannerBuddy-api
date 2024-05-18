module.exports = {
  up: async (queryInterface) => {
    // Generate an array of 100 user objects
    const users = Array.from({ length: 200 }, () => ({
      userId: 1,
      name: `User ${Math.floor(Math.random() * 100) + 1}`,
      email: `user${Math.floor(Math.random() * 100) + 1}@example.com`,
      phoneNumber: `9988${Math.floor(100000 + Math.random() * 900000)}`, // Generates a random 6-digit number
      address: `Address ${Math.floor(Math.random() * 100) + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('guests', users, { returning: true });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('guests', null, {});
  }
};
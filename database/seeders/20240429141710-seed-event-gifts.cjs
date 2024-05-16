module.exports = {
  up: async (queryInterface) => {
    const data = [];
    for (let eventId = 1; eventId <= 10; eventId += 1) {
      for (let guestId = 1; guestId <= 10; guestId += 1) {
        data.push({
          userId:1,
          eventId,
          guestId,
          amount: Math.floor(Math.random() * 1000),
          note: 'This is a note',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    await queryInterface.bulkInsert('event_gifts', data, {});
  },

  down: async (queryInterface) => {
    // Add commands to revert seed here.
    // Example:
    await queryInterface.bulkDelete('event_gifts', null, {});
  }
};
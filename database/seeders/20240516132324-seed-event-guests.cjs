module.exports = {
  up: async (queryInterface) => {
    const data = [];
    for (let eventId = 1; eventId <= 10; eventId += 1) {
      for (let guestId = 1; guestId <= 10; guestId += 1) {
        data.push({
          eventId,
          guestId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    await queryInterface.bulkInsert('event_guests', data, {});
  },

  down: async (queryInterface) => {
    // Add commands to revert seed here.
    // Example:
    await queryInterface.bulkDelete('event_guests', null, {});
  }
};
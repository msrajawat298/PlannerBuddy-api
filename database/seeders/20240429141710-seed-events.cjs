module.exports = {
  up: async (queryInterface) => {
    const eventList = ['Birthday', 'Party', 'Wedding', 'Funeral', 'Graduation', 'Meeting', 'Conference', 'Seminar', 'Workshop', 'Training', 'Retreat', 'Reunion', 'Festival', 'Carnival', 'Concert', 'Show', 'Exhibition', 'Fair', 'Market', 'Rally', 'Protest', 'Demonstration', 'March', 'Parade', 'Competition', 'Tournament', 'Game'];
    // Generate an array of 100 user objects
    const users = Array.from({ length: 200 }, () => ({
      userId: 1,
      eventName: eventList[Math.floor(Math.random() * eventList.length)],
      eventDate: new Date(),
      eventTime: `${Math.floor(Math.random() * 100) + 1}:${Math.floor(Math.random() * 100) + 1}`,
      eventLocation: `Address ${Math.floor(Math.random() * 100) + 1}`,
      eventStatus: '11',
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('events', users, { returning: true });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('events', null, {});
  }
};
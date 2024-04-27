export default (sequelize, Sequelize) => {
  const Event = sequelize.define(
    'event_guests',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      guestId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: true
    }
  );

  return Event;
};

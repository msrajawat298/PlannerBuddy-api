export default (sequelize, Sequelize) => {
  const EventGift = sequelize.define(
    'event_gifts',
    {
      giftId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true // Define id as primary key
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      guestId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    {
      timestamps: true
    }
  );

  // Define associations
  //   EventGift.belongsTo(sequelize.models.Event, { foreignKey: 'eventId', as: 'event' }); // EventGift belongs to Event
  //   EventGift.belongsTo(sequelize.models.Guest, { foreignKey: 'guestId', as: 'guest' }); // EventGift belongs to Guest

  return EventGift;
};

export default (sequelize, Sequelize) => {
  const EventGift = sequelize.define(
    'event_gifts',
    {
      giftId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isYourGift: {
        type: Sequelize.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'yes'
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
  return EventGift;
};

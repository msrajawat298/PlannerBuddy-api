import { Op } from 'sequelize';

export default (sequelize, Sequelize) => {
  const EventGuest = sequelize.define(
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
        allowNull: false,
        primaryKey: true,
        unique: 'event_guest_unique_constraint'
      },
      guestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: 'event_guest_unique_constraint'
      }
    },
    {
      timestamps: true
    },
    {
      // Define indexes
      indexes: [
        {
          unique: true,
          fields: ['eventId', 'guestId']
        }
      ]
    }
  );

  return EventGuest;
};

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

  EventGuest.beforeBulkCreate(async (guestEvents) => {
    try {
      // Check for existing entries with the same eventId and guestId
      const existingEntries = await EventGuest.findAll({
        where: {
          [Op.or]: guestEvents.map((event) => ({
            eventId: event.eventId,
            guestId: event.guestId
          }))
        }
      });

      // If any duplicate entries are found, prevent bulk create
      if (existingEntries.length > 0) {
        throw new Error('Duplicate entries detected');
      }
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  });

  return EventGuest;
};

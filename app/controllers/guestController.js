import e from 'cors';
import db from '../models/index.js';

const { guests: Guest } = db;

// Method to add new guests
export const addGuest = (req, res) => Guest.create({ ...req.body, userId: req.userId }).then(savedGuest => 
// Respond with the saved guest object
  res.status(200).send({ error: false, message: 'Guest added successfully', data: {guestId: savedGuest.guestId} })
).catch(err => {
  console.error('Error saving guest:', err);
  return res.status(500).send('Error saving guest.');
});

// Method to delete a guest
export const deleteGuest = (req, res) => {
  const { guestId } = req.query;
  const { userId } = req;

  Guest.destroy({ where: { guestId, userId }}).then(num => {
    if (num === 1) {
      res.send({ message: 'Guest deleted successfully!' });
    } else {
      res.send({ message: 'Guest not found!' });
    }
  }).catch((error) => {
    console.error('Error deleting guest:: ', error);
    res.status(500).send({ message: `Could not delete Guest with id=${  guestId}`, error:true, data: error });
  });
};

// Method to update details of an existing guest
export const updateGuest = (req, res) => {
  const { userId } = req;
  const { guestId } = req.params;
  Guest.update(
    {...req.body, userId: req.userId},
    { where: { userId, guestId } }
  ).then(([affectedCount]) => {
    if (affectedCount > 0) {
      res.send({ message: 'Guest updated successfully!' });
    } else {
      res.send({ error: true, message: 'No Guest Found' });
    }
  }).catch((err) => {
    console.error('Error updating guest:', err);
    res.status(500).send({ message: `Error updating Guest with id=${  guestId}` });
  });
};

export const getGuests = async (req, res) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const offset = (parsedPage - 1) * parsedLimit;

    const guests = await Guest.findAndCountAll({ 
      where: { userId }, 
      limit: parsedLimit, 
      offset, 
      order: [[sort, order]] // Add sorting
    });

    const totalPages = Math.ceil(guests.count / parsedLimit);
    if (parsedPage > totalPages) {
      res.status(400).send({ error: true, message: 'No data found' });
      return;
    }
    res.status(200).send({
      error: false,
      message: 'Request completed',
      guests: guests.rows,
      currentPage: parsedPage,
      totalPages,
      totalData: guests.count
    });
  } catch (err) {
    console.error('Error getting guests:', err);
    res.status(500).send({ message: 'Error getting guests' });
  }
};

export const getGuestByid = (req, res) => {
  const { userId } = req;
  const { guestId } = req.params;
  Guest.findOne({ where: { userId, guestId } }).then((guest) => {
    if (guest) {
      res.send({ data: guest });
    } else {
      res.send({ message: 'Guest not found!' });
    }
  }).catch((err) => {
    console.error('Error getting guest:', err);
    res.status(500).send({ message: 'Error getting guest' });
  });
};

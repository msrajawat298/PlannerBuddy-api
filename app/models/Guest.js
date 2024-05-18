export default (sequelize, Sequelize) => {
  const Guest = sequelize.define('guests', {
    guestId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        len: {
          args: [10, 10],
          msg: 'Phone number length should be 10'
        }
      }
    },
    address: {
      type: Sequelize.STRING
    }
  });

  return Guest;
};

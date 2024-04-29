export default (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    fullName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    phoneNumber: {
      type: Sequelize.STRING
    }
  });

  return User;
};

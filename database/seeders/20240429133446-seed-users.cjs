module.exports = {
  up: async (queryInterface) => {
    const userId = await queryInterface.bulkInsert('users', [
      { 
        fullName: 'Test User', 
        email: 'test@user.com', 
        password: '$2a$08$kO8SGO.nyNLC/Wg0ACkjw.wBrM963ns72mSljMCAtJLit/SmF.6Y.', // password
        phoneNumber: '9988776677', 
        createdAt: new Date(),
        updatedAt: new Date() 
      }
    ], {});
    const userRoles = [{
      userId,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }];
    await queryInterface.bulkInsert('user_roles', userRoles, {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('user_roles', null, {});
  }
};
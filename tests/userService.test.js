const userService = require('../src/services/userService');
const userModel = require('../src/models/userModel');

test('createUser should create a user with valid data', async () => {
    const mockUserData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
    };

    const user = await userService.createUser(mockUserData);

    expect(user).toMatchObject({
        name: mockUserData.name,
        email: mockUserData.email,
    });
    expect(user).toHaveProperty('userId');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
});

test('createUser should throw validation error for invalid data', async () => {
    const invalidUserData = {
        name: 1234567, // Invalid name (not a string)
        email: 'john.doe@example.com',
    };

    await expect(userService.createUser(invalidUserData)).rejects.toThrow('Validation error');
});

import { faker } from '@faker-js/faker';

export const createUser = (fields) => ({
  id: 0,
  name: faker.internet.userName(),
  ...fields
});

export const createRating = (fields) => ({
  gameId: 0, 
  fromId: 0, 
  toId: 0, 
  type: '',
  ...fields
});

export default {
  createUser,
  createRating,
  // ratings,
};

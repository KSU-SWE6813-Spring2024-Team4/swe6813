import { faker } from '@faker-js/faker';

export const createUser = (fields) => ({
  id: 0,
  username: faker.internet.userName(),
  ...fields
});

export default { createUser };

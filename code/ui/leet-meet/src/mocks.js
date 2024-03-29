import { faker } from '@faker-js/faker';
import { getRandomInt } from './util/Calculator';
import { 
  ATTRIBUTES,
  SKILLS
} from './util/Constants';

const RANDOM_COUNT = 50;

export const createUser = (fields) => ({
  id: 0,
  username: faker.internet.userName(),
  ...fields
});

const games = [
  { id: 1, title: 'Loop Hero' }, 
  { id: 2, title: 'Watch Dogs' },
  { id: 3, title: 'Assassin\'s Creed Valhalla' }, 
  { id: 4, title: 'Vampire Survivors' },
  { id: 5, title: 'Call of Duty' }
]

const users = {}
for (let i = 1; i <= RANDOM_COUNT; i++) {
  users[i] = createUser({ id: i });
}

const seedFollowers = () => Object.keys(users)
  .sort(() => 0.5 - Math.random())
  .slice(0, getRandomInt(RANDOM_COUNT));

const gameFollowers = games.reduce((acc, game) => {
  acc[game.id] = seedFollowers();
  return acc;
}, {});

const userFollowers = Object.keys(users).reduce((acc, userId) => {
  acc[userId] = seedFollowers();
  return acc;
}, {});

export const createRating = (fields) => ({
  gameId: 0, 
  fromId: 0, 
  toId: 0, 
  type: '',
  ...fields
});

const ratings = Object.keys(gameFollowers).reduce((allRatings, gameId) => {
  allRatings[gameId] = gameFollowers[gameId].reduce((userRatings, userId) => {
    userRatings[userId] = {
      skill: [],
      attribute: []
    };

    const ticks = getRandomInt(RANDOM_COUNT);
    for (let i = 0; i <= ticks; i++) {
      const maybeFrom = getRandomInt(RANDOM_COUNT);
      if (maybeFrom !== userId && maybeFrom !== 0) {
        userRatings[userId].attribute.push(createRating({ 
          gameId, 
          fromId: maybeFrom, 
          toId: userId, 
          type: ATTRIBUTES[getRandomInt(ATTRIBUTES.length)] 
        }));

        userRatings[userId].skill.push(createRating({ 
          gameId, 
          fromId: maybeFrom, 
          toId: userId, 
          type: SKILLS[getRandomInt(SKILLS.length)] 
        }));
      }
    }

    return userRatings;
  }, {});

  return allRatings;
}, {})

export default {
  createUser,
  createRating,
  games,
  gameFollowers,
  ratings,
  seedFollowers,
  users,
  userFollowers,
};

import { faker } from '@faker-js/faker';
import { 
  ATTRIBUTES,
  SKILLS
} from './util/Constants';

const RANDOM_COUNT = 50;

const getRandomInt = (max) => Math.floor(Math.random() * max);

const createRandomUser = (id) => ({
  id,
  username: faker.internet.userName()
});

const games = [
  { id: 1, imageUrl: '', title: 'Loop Hero' }, 
  { id: 2, imageUrl: '', title: 'Watch Dogs' },
  { id: 3, imageUrl: '', title: 'Assassin\'s Creed Valhalla' }, 
  { id: 4, imageUrl: '', title: 'Vampire Survivors' },
  { id: 5, title: 'Call of Duty' }
]

const users = {}
for (let i = 1; i <= RANDOM_COUNT; i++) {
  users[i] = createRandomUser(i)
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
        userRatings[userId].attribute.push({ 
          gameId, 
          fromId: maybeFrom, 
          toId: userId, 
          type: ATTRIBUTES[getRandomInt(ATTRIBUTES.length)] 
        });

        userRatings[userId].skill.push({ 
          gameId, 
          fromId: maybeFrom, 
          toId: userId, 
          type: SKILLS[getRandomInt(SKILLS.length)] 
        });
      }
    }

    return userRatings;
  }, {});

  return allRatings;
}, {})

export default {
  games,
  gameFollowers,
  ratings,
  seedFollowers,
  users,
  userFollowers,
};

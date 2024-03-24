export function getOrdinal(n) {
  let ord = 'th';

  if (n % 10 == 1 && n % 100 != 11) {
    ord = 'st';
  } else if (n % 10 == 2 && n % 100 != 12) {
    ord = 'nd';
  } else if (n % 10 == 3 && n % 100 != 13) {
    ord = 'rd';
  }

  return ord;
}

export const getRatingCounts = (ratings) => {
  return {
    skill: ratings.skill.reduce((acc, curr) => {
      acc[curr.type] = acc[curr.type] ? acc[curr.type] + 1 : 1;
      return acc;
    }, {}),
    attribute: ratings.attribute.reduce((acc, curr) => {
      acc[curr.type] = acc[curr.type] ? acc[curr.type] + 1 : 1;
      return acc;
    }, {})
  }
};

export function getTopRatingsForUser(ratings) {
  const { skill, attribute } = getRatingCounts(ratings);

  return {
    skill: Object.keys(skill).reduce((acc, curr) => {
      if (!acc) {
        return curr;
      }

      return skill[curr] > skill[acc] ? curr : acc;
    }, null),
    attribute: Object.keys(attribute).reduce((acc, curr) => {
      if (!acc) {
        return curr;
      }

      return attribute[curr] > attribute[acc] ? curr : acc;
    }, null)
  }
}
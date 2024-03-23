export const getRatingCountsForUser = (ratings) => ({
  skill: ratings.skill.reduce((acc, curr) => {
    acc[curr.type] = acc[curr.type] ? acc[curr.type] + 1 : 1;
    return acc;
  }, {}),
  attribute: ratings.attribute.reduce((acc, curr) => {
    acc[curr.type] = acc[curr.type] ? acc[curr.type] + 1 : 1;
    return acc;
  }, {})
});

export function getTopRatingsForUser(ratings) {
  const { skill, attribute } = getRatingCountsForUser(ratings);

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
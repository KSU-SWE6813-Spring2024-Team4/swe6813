export function getRatingCountsForUser(ratings) {
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
}

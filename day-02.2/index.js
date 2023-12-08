import { getInput } from '../util/get-input.js';

async function main() {
  const input = getInput();
  const result = input
    .split('\n')
    .map(line => mapGame(/Game (\d+): (.+)/g.exec(line)))
    .map(game => ({
      ...game,
      maxValues: game.sets
        .reduce((prev, cur) => [...prev, ...cur], [])
        .reduce((prev, cur) => {
          return {
            ...prev,
            [cur.color]: Math.max(prev[cur.color] || 0, cur.count)
          };
        }, {})
    }))
    .map(game => ({
      ...game,
      power: Object.values(game.maxValues).reduce((a, b) => a * b, 1)
    }))
    .map(({power}) => power)
    .reduce((a, b) => a + b, 0);
    //.map(({ id }) => id)
    //.reduce((a, b) => a + b, 0);

  console.log(`------------------------------------------`);
  console.log(`The result is: ${JSON.stringify(result, null, 2)}`);
}

/**
 *
 * @param {string} info
 * @returns {{id: number; Array<Array<{count, color}>>}}
 */
function mapGame(info) {
  const [_, id, meta] = info;
  const sets = mapSets(meta);

  return {
    id: parseInt(id),
    sets
  };
}

/**
 *
 * @param {string} meta
 * @returns {Array<Array<{count, color}>>}
 */
function mapSets(meta) {
  const sets = meta.split(';');

  return sets
    .map(set => set
      .split(',')
      .map(cubes => mapCubes(cubes)));
}

/**
 *
 * @param {string} cubes
 * @returns {Array<{count, color}>}
 */
function mapCubes(cubes) {
  const [_, count, color] = /(\d+) (red|green|blue)/g.exec(cubes);

  return {
    count: parseInt(count),
    color
  };
}

/**
 *
 * @param {Array<{count, color}>} set
 */
function isValid(set) {
  const maximumValues = {
    red: 12,
    green: 13,
    blue: 14
  };

  const actualValues = Object
    .entries(maximumValues)
    .reduce((prev, [color]) => ({
      ...prev,
      [color]: set.find(x => x.color === color)?.count
    }), {});

  return Object
    .entries(actualValues)
    .filter(([_, v]) => !!v)
    .every(([color, actualValue]) => actualValue <= maximumValues[color]);
}
main();
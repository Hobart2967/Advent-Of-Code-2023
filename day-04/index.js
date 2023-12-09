import { getInput } from '../util/get-input.js';

async function main() {
  const input = getInput();
  const prep = input
    .split('\n')
    .map(line => mapCard(/Card\s+(\d+):\s+([^|]+)\|(.+)/g.exec(line)))
    .map(card => ({
      ...card,
      owningWinCount: card.owning.filter(number => card.winning.includes(number)).length
    }))
    .map(card => ({
      ...card,
      score: card.owningWinCount === 0
        ? 0
        : Math.pow(2, card.owningWinCount - 1)
    }));

  let winCount = Infinity;
  let cardIndex = 0;

  const cardsQueued = Array
    .from(new Array(prep.length))
    .reduce((prev, cur, index) => ({
      ...prev,
      [index]: 1
    }), {});

  let totalScratchCards = prep.length;

  while (winCount > 0 || cardIndex < prep.length) {
    const card = prep[cardIndex];
    winCount = card.owningWinCount;

    if (winCount > 0) {
      console.log(`Card ${cardIndex + 1} has won ${winCount} scratch cards. Cards Queued for ${cardIndex + 1}: ${cardsQueued[cardIndex]}`);

      for (let instanceCount = 0; instanceCount < cardsQueued[cardIndex]; instanceCount++) {
        for (let copyCardIndex = 1; copyCardIndex <= card.owningWinCount; copyCardIndex++) {
          cardsQueued[cardIndex + copyCardIndex]++;
          totalScratchCards++;
        }
      }
    }

    cardIndex++;
  }

  console.log('Total Scratchcards: ' + totalScratchCards);

  const result = prep
    .map(x => x.score)
    .reduce((a, b) => a + b, 0);

  console.log(`------------------------------------------`);
  console.log(`The result is: ${JSON.stringify(result, null, 2)}`);
}

/**
 *
 * @param {string} info
 * @returns {{id: number; Array<Array<{count, color}>>}}
 */
function mapCard(info) {
  const [_, id, winning, owning] = info;

  return {
    id: parseInt(id),
    winning: getAll(/\d+/g, winning)
      .map(x => +x),
    owning: getAll(/\d+/g, owning)
      .map(x => +x),
  };
}

function getAll(regex, str) {
  const results = [];
  let m;

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      results.push(match);
    });
  }

  return results;
}

main();
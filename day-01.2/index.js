import { getInput } from '../util/get-input.js';

async function main() {
  const input = getInput();
  const result = input
    .split('\n')
    .map(line => replaceLiterals(line)
        .split('')
        .filter(digit => /\d/.test(digit))
        .join(''))
    .map(x => x.replace(/^(\d).*(\d)$/g, '$1$2'))
    .map(x => x.length === 1 ? `${x}${x}` : x)
    .map(x => console.log(`Found digits: ${x}`) && x || x)
    .map(digits => +digits)
    .reduce((a, b) => a + b, 0);

  console.log(`------------------------------------------`);
  console.log(`The result is: ${result}`);
}

function replaceLiterals(line) {
  const replaceBy = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
  };

  let targetString = '';
  for (let i = 0; i <= line.length; i++) {
    if (/\d/g.test(line[i])) {
      targetString += line[i];
      continue;
    }

    const match = /^(one|two|three|four|five|six|seven|eight|nine)/.exec(line.substring(i));
    if (match && match[1]) {
      targetString += `${replaceBy[match[1]]}`;
    }
  }
  return targetString;
}
main();
import { getInput } from '../util/get-input.js';

async function main() {
  const input = getInput();
  const result = input
    .split('\n')
    .map(line => line
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

main();
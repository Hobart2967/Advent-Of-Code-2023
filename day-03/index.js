import { getInput } from '../util/get-input.js';

async function main() {
  const input = getInput();

  const lines = input.split('\n');
  const foundNumbers = [];

  for (let linePointer = 0; linePointer < lines.length; linePointer++) {
    console.log('Line ' + linePointer);
    const current = lines[linePointer];
    const next = lines[linePointer + 1];
    const previous = lines[linePointer - 1];

    const initialStart = getNextNumber(0, current);
    for (let from = initialStart; from < current.length; from++) {
      const to = getNextNonNumber(from, current);
      const number = current.substring(from, to);
      if (!number) {
        continue;
      }

      // Leading symbol
      if (from > 0 && isSymbol(current[from - 1])) {
        addFoundNumber(foundNumbers, number);
      }

      // Trailing Symbol
      if (to < (current.length - 1) && isSymbol(current[to])) {
        addFoundNumber(foundNumbers, number);
      }

      // Lower Symbol
      if (!!next && next.substring(from - 1, to + 1).split('').some(x => isSymbol(x))) {
        addFoundNumber(foundNumbers, number);
      }

      if (!!previous && previous.substring(from - 1, to + 1).split('').some(x => isSymbol(x))) {
        addFoundNumber(foundNumbers, number);
      }

      //console.log('Found ' + number + '\t at ' + from  + ' to ' + to);

      from = to;
    }
  }

  const result = foundNumbers.reduce((a, b) => a + b, 0);

  console.log(`------------------------------------------`);
  console.log(`The result is: ${result}`);
}

function isSymbol(char) {
  return char !== '.' && !(/\d/.test(char));
}

function addFoundNumber(foundNumbers, number) {
  console.log('FOUND PARTNUMBER ' + number);
  foundNumbers.push(+number);
}

function getNextNumber(start, line) {
  const result = line
    .substring(start)
    .split('')
    .findIndex(x => /\d/.test(x)) + start;

  if (result < 0) {
    return Infinity;
  }

  return result + start;
}

function getNextNonNumber(start, line) {
  const result = line
    .substring(start)
    .split('')
    .findIndex(x => !/\d/.test(x));
  if (result < 0) {
    return Infinity;
  }

  return result + start;
}

main();
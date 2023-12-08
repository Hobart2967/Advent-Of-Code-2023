import fs from 'fs';

import { getInput } from '../util/get-input.js';

const foundNumbers = [];
const foundSymbols = [];

async function main() {
  const input = getInput();

  const lines = input.split('\n');
  for (let linePointer = 0; linePointer < lines.length; linePointer++) {
    console.log('Line ' + linePointer);
    const current = lines[linePointer];
    const next = lines[linePointer + 1];
    const previous = lines[linePointer - 1];

    const initialStart = getNextNumber(0, current);
    for (let from = initialStart; from < current.length; from++) {
      const to = getNextNonNumber(from, current);
      const number = +current.substring(from, to);
      if (!number) {
        continue;
      }

      // Leading symbol
      if (from > 0 && isSymbol(current[from - 1])) {
        addFoundNumber(number);

        registerSymbolMapping(lines, linePointer, from - 1, {
          line: linePointer,
          from,
          to,
          number
        });
      }

      // Trailing Symbol
      if (to < (current.length - 1) && isSymbol(current[to])) {
        addFoundNumber(number);

        registerSymbolMapping(lines, linePointer, to, {
          line: linePointer,
          from,
          to,
          number
        });
      }

      // Lower Symbol
      if (!!next) {
        const locallyFoundSymbols = next
          .substring(Math.max(0, from - 1), Math.min(next.length, to + 1))
          .split('')
          .map((x, i) => ({
            index: i + Math.max(0, from - 1),
            isSymbol: isSymbol(x)
          }))
          .filter(x => x.isSymbol);

        if (locallyFoundSymbols.length) {
          addFoundNumber(number);

          for (const result of locallyFoundSymbols) {
            registerSymbolMapping(lines, linePointer + 1, result.index, {
              line: linePointer,
              from,
              to,
              number
            });
          }
        }
      }

      if (!!previous) {
        const locallyFoundSymbols = previous
          .substring(Math.max(0, from - 1), Math.min(previous.length, to + 1))
          .split('')
          .map((x, i) => ({
            index: i + Math.max(0, from - 1),
            isSymbol: isSymbol(x)
          }))
          .filter(x => x.isSymbol);

        if (locallyFoundSymbols.length) {
          addFoundNumber(number);

          for (const result of locallyFoundSymbols) {
            registerSymbolMapping(lines, linePointer - 1, result.index, {
              line: linePointer,
              from,
              to,
              number
            });
          }
        }
      }
      //console.log('Found ' + number + '\t at ' + from  + ' to ' + to);

      from = to;
    }
  }

  fs.writeFileSync('out.json', JSON.stringify(foundSymbols, null, 2));

  console.log(JSON.stringify(foundSymbols
    .filter(x => x.literal === '*')
    .filter(x => x.numbers.length === 2)
    , null, 2));
  const result =
    foundSymbols
      .filter(x => x.literal === '*')
      .filter(x => x.numbers.length === 2)
      .map(x => x.numbers
        .map(({number}) => number)
        .reduce((a, b) => a * b, 1))
      .reduce((a, b) => a + b, 0);


  console.log(`------------------------------------------`);
  console.log(`The result is: ${result}`);
}

function registerSymbolMapping(lines, line, x, numberInfo) {
  let foundSymbol = foundSymbols.find(symbol => symbol.line === line && symbol.x === x);
  if (!foundSymbol) {
    foundSymbol = {
      literal: lines[line][x],
      line,
      x,
      numbers: []
    };
    foundSymbols.push(foundSymbol)
  }

  foundSymbol.numbers.push(numberInfo);
}

function isSymbol(char) {
  return char !== '.' && !(/\d/.test(char));
}

function addFoundNumber(number) {
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
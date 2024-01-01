import * as _ from 'lodash';

const getLines = (text: string): string[] => {
  const lines = _.split(text, /\r?\n/);
  return lines;
};

export function removeDuplicatedLines(text: string): string {
  const lines = getLines(text);
  const uniqueLines = _.uniq(lines);
  return uniqueLines.join('\n');
}

export function sortLines(text: string): string {
  const lines = _.split(text, /\r?\n/);
  const sortedLines = _.sortBy(lines);
  return sortedLines.join('\n');
}

export function getUniqueCharacters(text: string): string {
  const uniqueChars = new Set(text.split(/\s+|\r\n|\r|\n/));
  const sortedUniqueChars = Array.from(uniqueChars).sort();
  return sortedUniqueChars.join('\n');
}

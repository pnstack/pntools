import { getUniqueCharacters, removeDuplicatedLines, sortLines } from './text';

export enum FormatTool {
  DEFAULT = 'Default',
  REMOVE_DUMPLICATE_LINE = 'remove dumplicate line',
  SORT_LINE = 'Sort line',
  GET_CHAR = 'Get char',
}

export const formatFunc = {
  [FormatTool.DEFAULT]: (text: string) => text,
  [FormatTool.REMOVE_DUMPLICATE_LINE]: removeDuplicatedLines,
  [FormatTool.SORT_LINE]: sortLines,
  [FormatTool.GET_CHAR]: getUniqueCharacters,
};

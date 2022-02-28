import blacklistedWords from "./list";

export const validate = (word: string) => {
  word = word.trim();
  word = word.toLowerCase();

  return blacklistedWords.indexOf(word) === -1;
};

export const list = blacklistedWords;

export default {
  validate,
  list: blacklistedWords,
};

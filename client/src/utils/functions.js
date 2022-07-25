export const findPartsOfForm = (labelName, indexes) => {
  return indexes.filter((element) => {
    if (element.LABEL.includes(labelName)) return element;
  });
};
export const getlabelList = (indexes) => {
  return new Set(indexes.map((element) => element.LABEL.split("|")[0].trim()));
};

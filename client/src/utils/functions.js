export const findPartsOfForm = (labelName, indexes) => {
  return indexes.filter((element) => {
    if (element.LABEL.includes(labelName)) {
      return element;
    }
  });
};
export const getlabelList = (indexes) => {
  return new Set(indexes.map((element) => element.LABEL.split("|")[0].trim()));
};

export const convertObjectToArrayOfObject = (obj) => {
  return (
    obj &&
    Object.entries(obj).map((entry) =>
      Object.assign({}, { id: entry[0], label: entry[1] })
    )
  );
};

export const getDefaultProps = (props) => {
  return {
    options: props,
    getOptionLabel: (option) => {
      return option?.label ?? "";
    },
  };
};

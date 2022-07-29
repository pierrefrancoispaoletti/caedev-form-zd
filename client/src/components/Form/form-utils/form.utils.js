import { useCallback } from "react";
import { modeleArticle } from "../../datas";

const useHandleChangeTextInput = (setter, state) =>
  useCallback(
    (e, label) => {
      const { value, name } = e.target;
      setter({
        ...state,
        [label]: { ...state[label], [name]: { ...state[label][name], value } },
      });
    },
    [setter, state]
  );

const useHandleChangeSelectInput = (setter, state) =>
  useCallback(
    (e, label, newValue, ligne) => {
      const { id } = e.target;
      const shortLabel = id.split("__")[1];

      if (shortLabel !== "axeAnalytique") {
        setter({
          ...state,
          [label]: {
            ...state[label],
            [shortLabel]: { ...state[label][shortLabel], value: newValue },
          },
        });
      } else {
        let oldArticles = [...state["Comptabilité"]["Articles"]];

        oldArticles = oldArticles.map((article, index) => {
          if (ligne === index) {
            return {
              ...article,
              axeAnalytique: { ...article["axeAnalytique"], value: newValue },
            };
          } else {
            return article;
          }
        });

        setter({
          ...state,
          Comptabilité: {
            ...state["Comptabilité"],
            Articles: [...oldArticles],
          },
        });
      }
    },
    [setter, state]
  );

const useHandleAddArticle = (setter, state) =>
  useCallback(() => {
    setter({
      ...state,
      Comptabilité: {
        ...state["Comptabilité"],
        Articles: [...state["Comptabilité"]["Articles"], { ...modeleArticle }],
      },
    });
  }, [setter, state]);

const useHandleChangeArticle = (setter, state) =>
  useCallback(
    (ligne) => (e) => {
      const { name, value } = e.target;

      let oldArticles = [...state["Comptabilité"]["Articles"]];

      oldArticles[ligne][name] = value;

      setter({
        ...state,
        Comptabilité: {
          ...state["Comptabilité"],
          Articles: [...oldArticles],
        },
      });
    },
    [setter, state]
  );

const useHandleDeleteArticle = (setter, state) =>
  useCallback(
    (index) => {
      let oldArticles = [...state["Comptabilité"]["Articles"]];

      let newArticles = oldArticles.filter(
        (element, indexeElement) => indexeElement !== index
      );

      setter({
        ...state,
        Comptabilité: {
          ...state["Comptabilité"],
          Articles: [...newArticles],
        },
      });
    },
    [setter, state]
  ); //

const useComputeTotalAmount = (state) =>
  useCallback(() => {
    const allArticles = [...state["Comptabilité"]["Articles"]];

    let amount = allArticles.reduce(
      (sum, element) => sum + Number(element.montantHT),
      0
    );

    return amount;
  }, [state]);

export {
  useHandleAddArticle,
  useHandleDeleteArticle,
  useHandleChangeSelectInput,
  useHandleChangeArticle,
  useComputeTotalAmount,
  useHandleChangeTextInput,
};

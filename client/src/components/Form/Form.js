import {
  Box,
  FormControl,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  Stack,
  Button,
  Container,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  convertObjectToArrayOfObject,
  getDefaultProps,
} from "../../utils/functions";
import { modeleArticle } from "../datas";
import Virtualize from "../AxeAnalytique/AxeAnalytique";
const Form = ({ labels, datas, state, setState }) => {
  const [analytique, setAnalytique] = useState({});
  ////////////////////////////////////////////////////////////////////////////////////////
  /////////////// Au chargement de l'application, j'ajoute un article et je vais chercher l'analytique ///////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (
      Object.keys(state).length > 0 &&
      state["Comptabilité"]["Articles"].length === 0
    ) {
      handleAddArticle();
    }
    axiosCallGetAnalytique();
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////  Recuperation de l'analytique //////////////////////////////
  const axiosCallGetAnalytique = async () => {
    let response = await axios({
      method: "GET",
      url: "https://armoires.zeendoc.com/ca_edeveloppement/_ClientSpecific/React_Form_DE/REST_API_ANALYTIQUE.php",
    });

    if (response.status === 200 && Object.keys(analytique).length === 0) {
      let parsedDatas = JSON.parse(response.data.analytique)[0];

      let newAnalytique = convertObjectToArrayOfObject(parsedDatas.VALEURS);

      setAnalytique([...newAnalytique]);
    }
  };

  //////////////////////////////// Envoi des données //////////////////////////////////
  /////
  const axiosCall = async () => {
    const response = await axios({
      method: "POST",
      url: "traitement.php",
      data: state,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosCall();
  };
  ///////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////
  ///// convertion de l'analytique au format tableau d'objet ////
  const defaultPropsAnalytique = getDefaultProps(analytique);
  ////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////
  //// Fonctions de modification de l'etat du formulaire ////
  const handleChangeTextInput = useCallback(
    (e, label) => {
      const { value, name } = e.target;
      setState({
        ...state,
        [label]: { ...state[label], [name]: { ...state[label][name], value } },
      });
    },
    [setState, state]
  );

  const handleChangeSelectInput = useCallback(
    (e, label, newValue, ligne) => {
      const { id } = e.target;
      const shortLabel = id.split("__")[1];

      if (shortLabel !== "axeAnalytique") {
        setState({
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

        setState({
          ...state,
          Comptabilité: {
            ...state["Comptabilité"],
            Articles: [...oldArticles],
          },
        });
      }
    },
    [setState, state]
  );

  const handleAddArticle = useCallback(() => {
    setState({
      ...state,
      Comptabilité: {
        ...state["Comptabilité"],
        Articles: [...state["Comptabilité"]["Articles"], { ...modeleArticle }],
      },
    });
  }, [setState, state]);

  const handleChangeArticle = useCallback(
    (ligne) => (e) => {
      const { name, value } = e.target;

      let oldArticles = [...state["Comptabilité"]["Articles"]];

      oldArticles[ligne][name] = value;

      setState({
        ...state,
        Comptabilité: {
          ...state["Comptabilité"],
          Articles: [...oldArticles],
        },
      });
    },
    [setState, state]
  );

  const handleDeleteArticle = useCallback(
    (index) => {
      let oldArticles = [...state["Comptabilité"]["Articles"]];

      let newArticles = oldArticles.filter(
        (element, indexeElement) => indexeElement !== index
      );

      setState({
        ...state,
        Comptabilité: {
          ...state["Comptabilité"],
          Articles: [...newArticles],
        },
      });
    },
    [setState, state]
  ); //

  const computeTotalAmount = useCallback(() => {
    const allArticles = [...state["Comptabilité"]["Articles"]];

    let amount = allArticles.reduce(
      (sum, element) => sum + Number(element.montantHT),
      0
    );
    return amount;
  }, [state]);
  /////////////////////////////////////////////////////////////////////////////////////////

  const checkBudget = (budgetTotal, montantTotalArticles) => {
    if (budgetTotal && montantTotalArticles) {
      if (Number(montantTotalArticles) <= Number(budgetTotal)) {
        setState({
          ...state,
          Validation: {
            ...state.Validation,
            "Je respecte le Budget": {
              ...state.Validation["Je respecte le Budget"],
              value: { id: 1, label: "Oui" },
              error: false,
            },
          },
        });
      } else {
        setState({
          ...state,
          Validation: {
            ...state.Validation,
            "Je respecte le Budget": {
              ...state.Validation["Je respecte le Budget"],
              value: { id: 2, label: "Non" },
              error: true,
            },
          },
        });
      }
    }
  };
  let budgetTotal = state["Validation"]["Montant du Budget HT"].value;

  let montantTotalArticles = computeTotalAmount();

  useEffect(() => {
    checkBudget(budgetTotal, montantTotalArticles);
  }, [budgetTotal, montantTotalArticles]);

  return (
    <Box
      component="form"
      sx={{ border: "1px solid black", padding: "1.3em", margin: "5% 15%" }}
      onSubmit={handleSubmit}
    >
      {labels.map((label, index) => {
        const currentData = datas[index];
        return (
          <Stack key={label + "-" + index} spacing={4}>
            <h2
              style={{
                display: state?.[label]?.hidden ? "none" : "",
                backgroundColor: "#1D9E90",
                padding: "12px",
                height: "",
                color: "white",
                borderRadius: "30px",
              }}
            >
              {label}
            </h2>
            {currentData.map((data) => {
              let {
                SHORT_LABEL: shortLabel,
                VALEURS: valeurs,
                COLUMN: column,
                TYPE: type,
                MANDATORY: required,
              } = data;

              if (required) {
                required = true;
              } else {
                required = false;
              }

              const newValeurs = convertObjectToArrayOfObject(valeurs);

              const defaultProps = {
                options: newValeurs,
                getOptionLabel: (option) => {
                  return option?.label ?? "";
                },
              };

              return (
                <FormControl
                  key={label + "-" + shortLabel}
                  required={required}
                  sx={{
                    display: state?.[label]?.[shortLabel]?.hidden ? "none" : "",
                  }}
                >
                  {valeurs &&
                  type !== "VENTILATION_HT" &&
                  Object.keys(valeurs).length > 0 ? (
                    <>
                      <Autocomplete
                        {...defaultProps}
                        id={`${column}__${shortLabel}__`}
                        value={state?.[label]?.[shortLabel]?.value ?? ""}
                        onChange={(e, newValue) =>
                          handleChangeSelectInput(e, label, newValue)
                        }
                        disableClearable
                        disabled={
                          state?.[label]?.[shortLabel]?.disabled ?? false
                        }
                        renderInput={(params) => {
                          return (
                            <TextField
                              error={
                                state?.[label]?.[shortLabel]?.error ?? false
                              }
                              {...params}
                              label={shortLabel}
                              variant="filled"
                              required={required}
                              size="small"
                            />
                          );
                        }}
                      />
                    </>
                  ) : type !== "VENTILATION_HT" ? (
                    <TextField
                      disabled={state?.[label]?.[shortLabel]?.disabled ?? false}
                      type={state?.[label]?.[shortLabel]?.type}
                      id={column}
                      name={shortLabel}
                      label={shortLabel}
                      required={required}
                      inputProps={
                        state?.[label]?.[shortLabel]?.type === "date"
                          ? {
                              min: state?.[label]?.[shortLabel]?.min,
                            }
                          : {}
                      }
                      value={
                        shortLabel !== "Total Articles Prestations HT"
                          ? state?.[label]?.[shortLabel]?.value
                          : computeTotalAmount()
                      }
                      onChange={(e) => handleChangeTextInput(e, label)}
                    />
                  ) : (
                    <Container
                      sx={{
                        width: "80%",
                        justifyContent: "stretch",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Stack spacing={3}>
                        {Object.keys(state).length > 0 &&
                          state["Comptabilité"]["Articles"].map(
                            (element, index) => (
                              <Container key={index}>
                                <Stack spacing={2}>
                                  <FormControl fullWidth required={required}>
                                    <InputLabel id="nom_article_ventilation">
                                      Nom de l'article
                                    </InputLabel>
                                    <Select
                                      name="nomArticleVentilation"
                                      labelId="nom_article_ventilation"
                                      label="Nom de l'article"
                                      value={
                                        state["Comptabilité"]["Articles"][
                                          index
                                        ]["nomArticleVentilation"]
                                      }
                                      onChange={handleChangeArticle(index)}
                                    >
                                      {Object.keys(valeurs).map((valeur) => {
                                        const article = `${
                                          valeurs[valeur].split(" - ")[0]
                                        } - ${valeurs[valeur].split(" - ")[1]}`;
                                        return (
                                          <MenuItem key={valeur} value={valeur}>
                                            {article}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  <FormControl fullWidth required={required}>
                                    <TextField
                                      name="montantHT"
                                      id="montant_ht_ventilation"
                                      label="Montant HT"
                                      required={required}
                                      value={
                                        state["Comptabilité"]["Articles"][
                                          index
                                        ]["montantHT"]
                                      }
                                      onChange={handleChangeArticle(index)}
                                    />
                                  </FormControl>
                                  <FormControl fullWidth required={required}>
                                    <InputLabel id="compte_comptable_TVA">
                                      Compte comptable
                                    </InputLabel>
                                    <Select
                                      name="compteComptableTVA"
                                      labelId="compte_comptable_TVA"
                                      label="Compte comptable"
                                      value={
                                        state["Comptabilité"]["Articles"][
                                          index
                                        ]["compteComptableTVA"]
                                      }
                                      onChange={handleChangeArticle(index)}
                                    >
                                      {Object.keys(valeurs).map((valeur) => {
                                        const compte = `${
                                          valeurs[valeur].split(" - ")[2]
                                        } - ${valeurs[valeur].split(" - ")[3]}`;
                                        return (
                                          <MenuItem key={valeur} value={compte}>
                                            {compte}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  {/* 
                                  {Object.keys(analytique).length && (
                                    <FormControl>
                                      <Autocomplete
                                        {...defaultPropsAnalytique}
                                        id={`${"custom_n1"}__${"axeAnalytique"}__`}
                                        value={
                                          state["Comptabilité"]["Articles"][
                                            index
                                          ]["axeAnalytique"]?.value ?? ""
                                        }
                                        onChange={(e, newValue) =>
                                          handleChangeSelectInput(
                                            e,
                                            label,
                                            newValue,
                                            index
                                          )
                                        }
                                        disableClearable
                                        disabled={
                                          state?.[label]?.[shortLabel]
                                            ?.disabled ?? false
                                        }
                                        renderInput={(params) => {
                                          return (
                                            <TextField
                                              error={
                                                state?.[label]?.[shortLabel]
                                                  ?.error ?? false
                                              }
                                              {...params}
                                              label="Axe Analytique"
                                              variant="filled"
                                              size="small"
                                            />
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  )} */}
                                  <Virtualize
                                    {...defaultPropsAnalytique}
                                    state={state}
                                    handleChangeSelectInput={
                                      handleChangeSelectInput
                                    }
                                    index={index}
                                    label={label}
                                    shortLabel={shortLabel}
                                    required={required}
                                  />
                                </Stack>

                                <Container
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Button
                                    sx={{
                                      marginTop: "12px",
                                    }}
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    size="small"
                                    onClick={() => handleDeleteArticle(index)}
                                  >
                                    <ClearIcon />
                                  </Button>
                                </Container>
                              </Container>
                            )
                          )}
                        <Container
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            type="button"
                            size="small"
                            onClick={() => handleAddArticle()}
                          >
                            <AddIcon />
                          </Button>
                        </Container>
                      </Stack>
                    </Container>
                  )}
                </FormControl>
              );
            })}
          </Stack>
        );
      })}

      <Container
        sx={{ marginTop: "2em", display: "flex", justifyContent: "center" }}
      >
        <Button size="large" variant="contained" color="success" type="submit">
          <CheckIcon />
          Soumettre
        </Button>
      </Container>
    </Box>
  );
};

export default Form;

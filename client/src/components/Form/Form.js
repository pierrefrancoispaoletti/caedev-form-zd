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
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  convertObjectToArrayOfObject,
  getDefaultProps,
} from "../../utils/functions";
import { modeleArticle } from "../datas";
import Virtualize from "../AxeAnalytique/AxeAnalytique";
import { initialStateConfigObject } from "../../config/configInitialState";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Form = ({ labels, datas, state, setState }) => {
  const [analytique, setAnalytique] = useState({});
  const [message, setMessage] = useState({});

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

    if (response.data.status === "OK") {
      setMessage({
        message: "Votre demande à été soumise avec succés",
        status: "success",
      });
      setTimeout(() => {
        setMessage({});
      }, 7000);
      setState({ ...initialStateConfigObject });
    } else {
      setMessage({
        message:
          "il y à eu une erreur lors de la soumission de votre formulaire",
        status: "error",
      });
      setTimeout(() => {
        setMessage("");
      }, 7000);
    }
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

  const handleCloseAlertMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage({});
  };

  return (
    <Box
      component="form"
      sx={{
        border: "1px solid black",
        padding: "1em",
        margin: "2% 15%",
      }}
      onSubmit={handleSubmit}
    >
      {Object.keys(message).length > 0 && (
        <Snackbar
          open={Object.keys(message).length > 0 ? true : false}
          autoHideDuration={6000}
          onClose={handleCloseAlertMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlertMessage}
            severity={message.status}
            sx={{ width: "100%" }}
          >
            {message.message}
          </Alert>
        </Snackbar>
      )}
      {labels.map((label, index) => {
        const currentData = datas[index];
        return (
          <Stack key={label + "-" + index} spacing={4}>
            <h2
              style={{
                display: state?.[label]?.hidden ? "none" : "",
                backgroundColor: "#1D9E90",
                padding: "12px",
                color: "white",
                borderRadius: "30px",
                margin: "12px 0 12px",
                fontSize: "1.2em",
                textTransform: "uppercase",
                fontWeight: "700",
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
                  size="small"
                  key={label + "-" + shortLabel}
                  required={required}
                  sx={{
                    display: state?.[label]?.[shortLabel]?.hidden ? "none" : "",
                    marginTop: "12px !important",
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
                        disablePortal
                        disableClearable
                        autoComplete
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
                              label={
                                state?.[label]?.[shortLabel]?.label ??
                                shortLabel
                              }
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
                      size="small"
                      disabled={state?.[label]?.[shortLabel]?.disabled ?? false}
                      type={state?.[label]?.[shortLabel]?.type}
                      id={column}
                      name={shortLabel}
                      label={state?.[label]?.[shortLabel]?.label ?? shortLabel}
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
                                  <FormControl
                                    size="small"
                                    fullWidth
                                    required={required}
                                  >
                                    <InputLabel id="nom_article_ventilation">
                                      Nom de l'article / Prestation
                                    </InputLabel>
                                    <Select
                                      name="nomArticleVentilation"
                                      labelId="nom_article_ventilation"
                                      label="Nom de l'article / Prestation"
                                      value={
                                        state["Comptabilité"]["Articles"][
                                          index
                                        ]["nomArticleVentilation"]
                                      }
                                      onChange={handleChangeArticle(index)}
                                    >
                                      {Object.keys(valeurs).map((valeur) => {
                                        const article = `${valeurs[valeur]}`;
                                        return (
                                          <MenuItem key={valeur} value={valeur}>
                                            {article}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                  <FormControl
                                    size="small"
                                    fullWidth
                                    required={required}
                                  >
                                    <TextField
                                      size="small"
                                      name="commentaire"
                                      id="commentaire_article"
                                      label="Commentaire"
                                      value={
                                        state["Comptabilité"]["Articles"][
                                          index
                                        ]["commentaire"]
                                      }
                                      onChange={handleChangeArticle(index)}
                                    />
                                  </FormControl>
                                  <FormControl
                                    size="small"
                                    fullWidth
                                    required={required}
                                  >
                                    <TextField
                                      size="small"
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
                                  <FormControl
                                    size="small"
                                    fullWidth
                                    required={required}
                                  >
                                    <InputLabel id="compte_comptable_TVA">
                                      Compte comptable
                                    </InputLabel>
                                    <Select
                                      size="small"
                                      disabled
                                      name="nomArticleVentilation"
                                      labelId="compte_comptable_TVA"
                                      label="Compte comptable"
                                      value={
                                        state["Comptabilité"]["Articles"][
                                          index
                                        ]["nomArticleVentilation"]
                                      }
                                    >
                                      <MenuItem
                                        key={
                                          state["Comptabilité"]["Articles"][
                                            index
                                          ]["nomArticleVentilation"]
                                        }
                                        value={
                                          state["Comptabilité"]["Articles"][
                                            index
                                          ]["nomArticleVentilation"]
                                        }
                                      >
                                        {`${
                                          valeurs?.[
                                            state["Comptabilité"]["Articles"][
                                              index
                                            ]["nomArticleVentilation"]
                                          ]?.split(" - ")[2]
                                        } - ${
                                          valeurs?.[
                                            state["Comptabilité"]["Articles"][
                                              index
                                            ]["nomArticleVentilation"]
                                          ]?.split(" - ")[3]
                                        }`}
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
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
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "8px !important",
                          }}
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

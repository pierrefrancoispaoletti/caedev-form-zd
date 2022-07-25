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

import axios from "axios";
import { useCallback, useEffect } from "react";
import { modeleArticle } from "../datas";
const Form = ({ labels, datas, state, setState }) => {
  const axiosCall = async () => {
    const response = await axios({
      method: "POST",
      url: "traitement.php",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosCall();
  };

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
    (e, label, newValue) => {
      const { id } = e.target;
      const shortLabel = id.split("__")[1];
      setState({
        ...state,
        [label]: {
          ...state[label],
          [shortLabel]: { ...state[label][shortLabel], value: newValue },
        },
      });
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

  useEffect(() => {
    if (
      Object.keys(state).length > 0 &&
      state["Comptabilité"]["Articles"].length === 0
    ) {
      handleAddArticle();
    }
  }, []);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {labels.map((label, index) => {
        const currentData = datas[index];
        return (
          <Stack key={label + "-" + index} spacing={2}>
            <h2
              style={{
                display: state?.[label]?.hidden ? "none" : "",
              }}
            >
              {label}
            </h2>
            {currentData.map((data) => {
              const {
                SHORT_LABEL: shortLabel,
                VALEURS: valeurs,
                COLUMN: column,
                TYPE: type,
              } = data;

              const newValeurs =
                valeurs &&
                Object.entries(valeurs).map((entry) =>
                  Object.assign({}, { id: entry[0], label: entry[1] })
                );

              const defaultProps = {
                options: newValeurs,
                getOptionLabel: (option) => option?.label ?? "",
              };

              return (
                <FormControl
                  key={label + "-" + shortLabel}
                  fullWidth
                  sx={{
                    display: state?.[label]?.[shortLabel]?.hidden ? "none" : "",
                  }}
                >
                  {valeurs &&
                  type !== "VENTILATION_HT" &&
                  Object.keys(valeurs).length > 0 ? (
                    <>
                      {/* <InputLabel id={shortLabel}>{shortLabel}</InputLabel>
                      <Select
                        id={column}
                        name={shortLabel}
                        labelId={shortLabel}
                        label={shortLabel}
                        value={state?.[label]?.[shortLabel]?.value ?? ""}
                        onChange={(e) => handleChangeTextInput(e, label)}
                      >
                        <MenuItem value=""></MenuItem>
                        {Object.keys(valeurs).map((valeur) => {
                          return (
                            <MenuItem value={valeur}>
                              {valeurs[valeur]}
                            </MenuItem>
                          );
                        })}
                      </Select> */}
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
                              {...params}
                              label={shortLabel}
                              variant="outlined"
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
                        width: "100%",
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
                                  <FormControl fullWidth>
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
                                      <MenuItem value=""></MenuItem>
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
                                  <FormControl fullWidth>
                                    <TextField
                                      name="montantHT"
                                      id="montant_ht_ventilation"
                                      label="Montant HT"
                                      value={
                                        state["Comptabilité"]["Articles"][
                                          index
                                        ]["montantHT"]
                                      }
                                      onChange={handleChangeArticle(index)}
                                    />
                                  </FormControl>
                                  <FormControl fullWidth>
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
                                      <MenuItem value=""></MenuItem>
                                      {Object.keys(valeurs).map((valeur) => {
                                        const compte = `${
                                          valeurs[valeur].split(" - ")[2]
                                        } - ${valeurs[valeur].split(" - ")[3]}`;
                                        return (
                                          <MenuItem key={valeur} value={valeur}>
                                            {compte}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  </FormControl>
                                </Stack>

                                <Container
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Button
                                    sx={{
                                      borderRadius: "50%",
                                      padding: "14px 2px",
                                      fontSize: "1.3em",
                                    }}
                                    variant="contained"
                                    color="error"
                                    type="button"
                                    onClick={() => handleDeleteArticle(index)}
                                  >
                                    X
                                  </Button>
                                </Container>
                              </Container>
                            )
                          )}
                        <Container
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            sx={{
                              borderRadius: "50%",
                              padding: "14px 2px",
                              fontSize: "1.3em",
                            }}
                            variant="contained"
                            color="success"
                            type="button"
                            onClick={() => handleAddArticle()}
                          >
                            +
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

      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Button size="large" variant="outlined" color="success" type="submit">
          Soumettre
        </Button>
      </Container>
    </Box>
  );
};

export default Form;

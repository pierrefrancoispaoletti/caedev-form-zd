import {
  Box,
  FormControl,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  Stack,
  Button,
} from "@mui/material";
import { Container } from "@mui/system";

const constructForm = (labels, datas) => {
  return (
    <Box component="form">
      {labels.map((label, index) => {
        const currentData = datas[index];
        return (
          <Stack spacing={2}>
            <h2>{label}</h2>
            {currentData.map((data) => {
              const {
                SHORT_LABEL: shortLabel,
                VALEURS: valeurs,
                COLUMN: column,
                TYPE: type,
                MULTIVALUED: multivalued,
              } = data;

              return (
                <FormControl fullWidth>
                  {valeurs &&
                  type !== "VENTILATION_HT" &&
                  Object.keys(valeurs).length > 0 ? (
                    <>
                      <InputLabel id={shortLabel}>{shortLabel}</InputLabel>
                      <Select labelId={shortLabel} label={shortLabel}>
                        {Object.keys(valeurs).map((valeur) => {
                          return (
                            <MenuItem id={valeur}>{valeurs[valeur]}</MenuItem>
                          );
                        })}
                      </Select>
                    </>
                  ) : type !== "VENTILATION_HT" ? (
                    <TextField id={column} label={shortLabel} />
                  ) : (
                    <Container
                      fluid
                      sx={{
                        width: "100%",
                        justifyContent: "stretch",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Stack spacing={3}>
                        <Container>
                          <Stack spacing={2}>
                            <FormControl fullWidth>
                              <InputLabel id="nom_article_ventilation">
                                Nom de l'article
                              </InputLabel>
                              <Select
                                labelId="nom_article_ventilation"
                                label="Nom de l'article"
                              >
                                {Object.keys(valeurs).map((valeur) => {
                                  const article = `${
                                    valeurs[valeur].split(" -")[0]
                                  } - ${valeurs[valeur].split(" -")[1]}`;
                                  return (
                                    <MenuItem id={valeur}>{article}</MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                            <FormControl fullWidth>
                              <TextField
                                id="montant_ht_ventilation"
                                label="Montant HT"
                              />
                            </FormControl>
                            <FormControl fullWidth>
                              <InputLabel id="compte_comptable_TVA">
                                Compte comptable
                              </InputLabel>
                              <Select
                                labelId="compte_comptable_TVA"
                                label="Compte comptable"
                              >
                                {Object.keys(valeurs).map((valeur) => {
                                  const compte = `${
                                    valeurs[valeur].split(" -")[2]
                                  } - ${valeurs[valeur].split(" -")[3]}`;
                                  return (
                                    <MenuItem id={valeur}>{compte}</MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Container>
                        <Container
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            type="button"
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
    </Box>
  );
};

export default constructForm;

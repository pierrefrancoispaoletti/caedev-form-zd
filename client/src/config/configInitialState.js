const setDayDate = () => {
  return new Date().toISOString().split("T")[0];
};
// on initialise ici toutes les valeurs de depart de l'objet qui va dezterminer le state
export const initialStateConfigObject = {
  "Demande d'engagement": {
    "Demandée par": {
      type: "text",
      value: "",
      disabled: true,
      label: "Demandée par",
    },
    Objet: { type: "text", value: "", hidden: false },
    "Date de la demande": {
      type: "date",
      value: setDayDate(),
      disabled: true,
      label: "Date de la demande",
    },
    "DESTINATION ou OBJECTIF de la dépense": {
      type: "text",
      value: "",
      label: "DESTINATION ou OBJECTIF de la dépense",
    },
    "PROJET CONCERNE (nom du projet)": {
      type: "text",
      value: "",
      label: "PROJET CONCERNE (nom du projet)",
    },
    "DESCRIPTION DETAILLEE (critères techniques principaux)": {
      type: "text",
      value: "",
      label: "DESCRIPTION DETAILLEE (critères techniques principaux)",
    },
    "NOM DES FOURNISSEURS CONSULTES (joindre tous les devis)": {
      type: "text",
      value: "",
      label: "NOM DES FOURNISSEURS CONSULTES (joindre tous les devis)",
    },
    "FOURNISSEUR SELECTIONNE": {
      type: "text",
      value: "",
      label: "FOURNISSEUR SELECTIONNE",
    },
    "REFERENCE DU DEVIS SELECTIONNE": {
      type: "text",
      value: "",
      label: "REFERENCE DU DEVIS SELECTIONNE",
    },
    "DATE DU DEVIS SELECTIONNE": {
      type: "date",
      value: setDayDate(),
      min: setDayDate(),
      label: "DATE DU DEVIS SELECTIONNE",
    },
    "Type de demande d'achat": {
      type: "text",
      value: "",
      label: "Type de demande d'achat",
    },
  },
  "Informations Générales": {
    "Montant HT": {
      type: "number",
      value: "",
      min: 0,
      label: "Montant HT",
    },
    "Frais de port": {
      type: "number",
      value: "",
      min: 0,
      label: "Frais de port",
    },
  },
};

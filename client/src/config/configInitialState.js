const setDayDate = () => {
  return new Date().toISOString().split("T")[0];
};
// on initialise ici toutes les valeurs de depart de l'objet qui va dezterminer le state
export const initialStateConfigObject = {
  "Type de document": {
    hidden: true,
    "Type de document": {
      hidden: true,
      value: "",
      label: "Type de document",
    },
  },
  Formulaire: {
    Prescripteurs: {
      type: "text",
      value: "",
      disabled: true,
      label: "Prescripteurs (demandeur)",
    },
    "Nom de la demande": { type: "text", value: "", hidden: false },
    "Date de la demande": {
      type: "date",
      value: setDayDate(),
      disabled: true,
      label: "Date de la demande",
    },
    "Description détaillée": {
      type: "text",
      value: "",
      label: "Description détaillée",
    },
    "Adresse de livraison": {
      type: "text",
      value: "",
      required: true,
      label: "Adresse de livraison crédit agricole",
    },
  },
  Périodicité: {
    "Date de Début": {
      type: "date",
      value: setDayDate(),
      min: setDayDate(),
      label: "Date de début (incluse)",
    },
    "Date de Fin": {
      type: "date",
      value: setDayDate(),
      min: setDayDate(),
      label: "Date de fin (incluse)",
    },
  },
  Comptabilité: {
    Fournisseurs: { type: "text", value: "", label: "Fournisseur" },
    Articles: [],
    "Total Articles Prestations HT": {
      type: "text",
      value: "",
      disabled: true,
      label: "Total Articles/Prestations HT",
    },
    "Mode de facturation": {
      type: "text",
      value: "",
      hidden: false,
      label: "Mode de facturation",
    },
    Exporté: { type: "text", value: "", hidden: true },
  },
  Validation: {
    "Responsable N+1": {
      type: "text",
      value: "",
      hidden: false,
      label: "Responsable N+1",
    },
    "Responsable N+2": {
      type: "text",
      value: "",
      hidden: false,
      label: "Responsable N+2",
    },
    "Responsable N+3": {
      type: "text",
      value: "",
      hidden: false,
      label: "Responsable N+3",
    },
    "Montant du Budget HT": {
      type: "text",
      value: "",
      required: true,
      label: "Montant du budget HT",
    },
    "Je respecte le Budget": {
      type: "text",
      value: "",
      disabled: true,
      label: "Je respecte le budget",
    },
    Commentaire: { type: "text", value: "", label: "Commentaire" },
  },
};

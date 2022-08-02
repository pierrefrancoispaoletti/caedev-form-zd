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
    },
  },
  Formulaire: {
    Prescripteurs: {
      type: "text",
      value: "",
      disabled: true,
    },
    "Nom de la demande": { type: "text", value: "", hidden: true },
    "Date de la demande": {
      type: "date",
      value: setDayDate(),
      disabled: true,
    },
    "Description détaillée": { type: "text", value: "" },
    "Adresse de livraison": { type: "text", value: "" },
  },
  Périodicité: {
    "Date de Début": { type: "date", value: setDayDate(), min: setDayDate() },
    "Date de Fin": { type: "date", value: setDayDate(), min: setDayDate() },
  },
  Comptabilité: {
    Fournisseurs: { type: "text", value: "" },
    Articles: [],
    "Total Articles Prestations HT": {
      type: "text",
      value: "",
      disabled: true,
    },
    "Mode de facturation": { type: "text", value: "", hidden: true },
    Exporté: { type: "text", value: "", hidden: true },
  },
  Validation: {
    "Responsable N+1": { type: "text", value: "", hidden: false },
    "Responsable N+2": { type: "text", value: "", hidden: false },
    "Responsable N+3": { type: "text", value: "", hidden: false },
    "Montant du Budget HT": { type: "text", value: "" },
    "Je respecte le Budget": { type: "text", value: "", disabled: true },
    Commentaire: { type: "text", value: "" },
  },
  "Refusé par :": {
    hidden: true,
    "Refusé par :": { type: "text", value: "", hidden: true },
  },
};

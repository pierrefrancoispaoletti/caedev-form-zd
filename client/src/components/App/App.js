import Form from "../Form/Form";
import { indexCollection, user } from "../datas";
import { useEffect, useState } from "react";
import { findPartsOfForm, getlabelList } from "../../utils/functions";
import { initialStateConfigObject } from "../../config/configInitialState";

let edit = false;

function App() {
  // on crée l'etat de l'application au demarage
  const [state, setState] = useState({});

  useEffect(() => {
    setState({ ...initialStateConfigObject });
  }, []);

  //ici on recupere les données du serveur au lancement de l'app
  var userFromServer = window.user ?? user;
  var indexCollectionFromServer = window.indexCollection ?? indexCollection;

  // on recupere tous les labels pour generer les champs
  const labels = Array.from(getlabelList(indexCollectionFromServer));

  let formDatas = labels.map((labelName) =>
    findPartsOfForm(labelName, indexCollectionFromServer)
  );

  return (
    <div className="App">
      {Object.keys(state).length && (
        <Form
          labels={labels}
          datas={formDatas}
          state={state}
          setState={setState}
        />
      )}
    </div>
  );
}

export default App;

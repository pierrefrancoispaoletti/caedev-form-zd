import Form from "../Form/Form";
import { indexCollection, user } from "../datas";
import { useEffect, useState } from "react";
import { findPartsOfForm, getlabelList } from "../../utils/functions";
import { initialStateConfigObject } from "../../config/configInitialState";

let edit = false;

function App() {
  const [state, setState] = useState({});

  var userFromServer = window.user;
  var indexCollectionFromServer = window.indexCollection;
  var Res_Id = window.Res_id;
  var Coll_Id = window.Coll_Id;
  var datasFromBD = window.datasFromBd;

  useEffect(() => {
    if (!edit) {
      let initialState = { ...initialStateConfigObject };
      const userId = userFromServer.User_Id;
      const userFullName = `${userFromServer.FirstName} ${userFromServer.LastName}`;
      initialState.Formulaire.Prescripteurs.value = {
        id: userId,
        label: userFullName.trim(),
      };

      initialState["Type de document"]["Type de document"].value = {
        id: "1",
        label: "Formulaire",
      };
      setState({ ...initialState });
    }
  }, []);

  // on recupere tous les labels pour generer les champs
  const labels = Array.from(getlabelList(indexCollectionFromServer));

  let formDatas = labels.map((labelName) =>
    findPartsOfForm(labelName, indexCollectionFromServer)
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Formulaire de demande d'engagement</h1>
        <div className="App-decorator"></div>
      </header>
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

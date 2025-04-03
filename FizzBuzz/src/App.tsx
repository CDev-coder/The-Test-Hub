import "./App.css";
import Shell from "./components/shell";
import { Provider } from "react-redux";
import { store } from "./components/store"; // Import the Redux store

function App() {
  return (
    <>
      <Provider store={store}>
        <div className="container">
          <Shell />
        </div>
      </Provider>
    </>
  );
}

export default App;

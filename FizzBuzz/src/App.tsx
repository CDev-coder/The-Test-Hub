import "./App.css";
import Shell from "./components/shell";
import { Provider } from "react-redux";
import { store } from "./components/store"; // Import the Redux store

function App() {
  return (
    <>
      <Provider store={store}>
        <div className="container">
          <Shell title={"Let's Fizz or Buzz "} />
        </div>
      </Provider>
    </>
  );
}

export default App;

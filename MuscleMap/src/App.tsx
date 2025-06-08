import "./App.css";
import { MuscleGroup } from "./components/MuscleGroup";
import { MobileFixedButton } from "./components/MobileFixedButton";

function App() {
  return (
    <>
      <div className="parentLayer">
        <MobileFixedButton />
        <MuscleGroup size="medium" />
      </div>
    </>
  );
}

export default App;

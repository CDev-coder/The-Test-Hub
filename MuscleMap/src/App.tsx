import "./App.css";
import { MuscleGroup } from "./components/MuscleGroup";

function App() {
  return (
    <>
      <div className="parentLayer">
        <MuscleGroup size="medium" isMobile={false} />
      </div>
    </>
  );
}

export default App;

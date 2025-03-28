import React, { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setInputValue, setInputValue2 } from "./store/inputSlice";

const TextInput: React.FC = () => {
  //const [inputValue, setInputValue] = useState<string>("");///Save it logically
  //const [inputValue2, setInputValue2] = useState<string>("");
  //////////
  const dispatch = useDispatch();

  // Get the input values from the Redux store
  const inputValue = useSelector((state: RootState) => state.input.inputValue); //Save it to the store
  const inputValue2 = useSelector(
    (state: RootState) => state.input.inputValue2
  );

  const textId = useId();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Check if the value is empty
    if (value === "") {
      // Allow empty input if the user deletes the text
      if (name === "input1") {
        dispatch(setInputValue(0)); // Or set to '' for input1
      } else if (name === "input2") {
        dispatch(setInputValue2(0)); // Or set to '' for input2
      }
      return;
    }

    // Try to parse the value into a number
    let cleanedNum = parseInt(value, 10);

    // If the value can't be parsed to a number (i.e., NaN), set it to 0
    if (isNaN(cleanedNum)) {
      cleanedNum = 0;
    }

    // Dispatch the cleaned value to the Redux store
    if (name === "input1") {
      dispatch(setInputValue(cleanedNum));
    } else if (name === "input2") {
      dispatch(setInputValue2(cleanedNum));
    }
  };

  return (
    <div className="inputFields">
      <label htmlFor={textId}>Enter Total Number: </label>
      <input
        className="textInput"
        name="input1"
        id={textId}
        type="text"
        value={inputValue}
        onChange={handleInputChange} // Attach the event handler
        style={{
          padding: "8px",
          width: "200px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <p>Looking through {inputValue} entries</p>

      <label htmlFor={textId}>Enter FB Value: </label>
      <input
        className="textInput"
        id={textId}
        name="input2"
        type="text"
        value={inputValue2}
        onChange={handleInputChange} // Attach the event handler
        style={{
          padding: "8px",
          width: "200px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <p>Checking at every {inputValue2} index</p>
    </div>
  );
};

export default TextInput;

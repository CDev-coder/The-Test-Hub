import React, { JSX, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import fizzImage from "../assets/soda.png";
import buzzImage from "../assets/bolt.png";

const FBChecker: React.FC = () => {
  const numberValue = useSelector((state: RootState) => state.input.inputValue);
  const fbValue = useSelector((state: RootState) => state.input.inputValue2);
  const [imageToRender, setImageToRender] = useState<JSX.Element | null>(null);

  const getFizzyWithit = (
    copyNumValue: number,
    copyFBValue: number
  ): JSX.Element | null => {
    if (copyNumValue > 0) {
      return (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Array.from({ length: copyNumValue }, (_, index) => {
            const adjustedIndex = index + 1; // Start from 1 instead of 0
            const FizzingOrBuzzing = adjustedIndex % copyFBValue;
            console.log(FizzingOrBuzzing);
            if (FizzingOrBuzzing == 0) {
              return (
                <img
                  key={index}
                  className="imageElement animate-pulse"
                  src={buzzImage}
                  alt={`Buzz Image ${index + 1}`}
                />
              );
            } else {
              return (
                <img
                  key={index}
                  className="imageElement animate-bounce"
                  src={fizzImage}
                  alt={`Fizz Image ${index + 1}`}
                />
              );
            }
          })}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (numberValue != 0 && fbValue != 0) {
      const image = getFizzyWithit(numberValue, fbValue);
      setImageToRender(image); // Update the state with the result
    } else {
      setImageToRender(null);
    }
  }, [numberValue, fbValue]);

  return <>{imageToRender}</>;
};

export default FBChecker;

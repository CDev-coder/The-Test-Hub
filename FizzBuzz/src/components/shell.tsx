import React from "react";
import TextInput from "./inputFields";
import FBChecker from "./FBChecker";

interface ShellProps {}

const Shell: React.FC<ShellProps> = () => {
  return (
    <>
      <div className="titleArea">
        <h1 className="text-4xl font-bold text-yellow-400 animate-fizz">
          Fizz
        </h1>
        <h1 className="text-4xl font-bold">or</h1>
        <h1 className="text-4xl font-bold text-red-600">Buzz</h1>
      </div>
      <TextInput />
      <div className="displayArea">
        <FBChecker />
      </div>
    </>
  );
};

export default Shell;

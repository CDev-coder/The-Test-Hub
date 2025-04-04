import React from "react";
import TextInput from "./inputFields";
import FBChecker from "./FBChecker";

interface ShellProps {}

const Shell: React.FC<ShellProps> = () => {
  return (
    <>
      <div className="titleArea">
        <h1 className="text-4xl font-bold text-red-600 animate-pulse">Fizz</h1>
        <h1 className="text-4xl font-bold">or</h1>
        <h1 className="text-4xl font-bold text-yellow-600 animate-bounce">
          Buzz
        </h1>
      </div>
      <TextInput />
      <FBChecker />
    </>
  );
};

export default Shell;

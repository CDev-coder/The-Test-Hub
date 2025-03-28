import React from "react";
import TextInput from "./inputFields";
import FBChecker from "./FBChecker";

interface ShellProps {
  title: string;
}

const Shell: React.FC<ShellProps> = ({ title }) => {
  return (
    <>
      <div className="shellTitle">
        <h1>{title}</h1>
        <TextInput />
      </div>
      <div className="displayArea">
        <FBChecker />
      </div>
    </>
  );
};

export default Shell;

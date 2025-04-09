import React from "react";

interface SvgLineProps {
  width?: number;
  height?: number;
  parentWidth?: number;
  parentHeight?: number;
  color?: string;
  className?: string;
  lineType?: string;
}

const SingleLine: React.FC<SvgLineProps> = ({
  width = 50,
  height = 50,
  color = "black",
  className = "",
  lineType = "",
  parentHeight = 0,
}) => {
  const y = 2;

  const renderExtraLine = (lineType: string) => {
    switch (lineType) {
      case "V2":
      case "V2D1":
      case "V2D2":
        return (
          <line
            x1="0"
            y1={y + 10}
            x2={width}
            y2={y + 10}
            stroke={color}
            strokeWidth={4}
          />
        );
      default:
        return null;
    }
  };

  const getLinePosition = (lineType: string) => {
    switch (lineType) {
      case "V1":
        return { left: "5px", top: parentHeight / 2 + "px" };
      case "V1D1":
        return { left: "20px", top: "20px", transform: "rotate(-45deg)" };
      case "V1D2":
        return { right: "20px", top: "20px", transform: "rotate(45deg)" };
      case "V2":
        return { left: "5px", top: parentHeight / 2.5 + "px" };
      case "V2D1":
        return { left: "20px", top: "20px", transform: "rotate(-45deg)" };
      case "V2D2":
        return { right: "20px", top: "20px", transform: "rotate(45deg)" };
      default:
        return { left: "0px", top: "0px" };
    }
  };

  return (
    <div
      className={"SingleLine SingleLine_" + lineType}
      style={getLinePosition(lineType)}
    >
      <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        className={className + "_SVG"}
        role="img"
        aria-label="Line"
      >
        <line x1="0" y1={y} x2={width} y2={y} stroke={color} strokeWidth={4} />
        {renderExtraLine(lineType)}
      </svg>
    </div>
  );
};

export default SingleLine;

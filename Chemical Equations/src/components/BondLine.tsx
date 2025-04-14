import React from "react";

interface SvgLineProps {
  width?: number;
  height?: number;
  parentWidth?: number;
  parentHeight?: number;
  color?: string;
  className?: string;
  lineType?: string;
  parentType: string;
}

const BondLine: React.FC<SvgLineProps> = ({
  width = 50,
  height = 50,
  color = "black",
  className = "",
  lineType = "",
  parentHeight = 0,
  parentType = "",
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
      case "V2S":
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
      case "V1S":
        if (parentType == "Bond") {
          return {
            transform: "rotate(-90deg)",
            left: parentHeight / 3 + 8 + "px",
          };
        } else {
          return {
            transform: "rotate(-90deg)",
            left: parentHeight / 3 + 3 + "px",
          };
        }
      case "V2S":
        if (parentType == "Bond") {
          return {
            transform: "rotate(-90deg)",
            left: parentHeight / 3 + 4 + "px",
          };
        } else {
          return {
            transform: "rotate(-90deg)",
            left: parentHeight / 4 + 3 + "px",
          };
        }
      case "V1D1":
        if (parentType == "Bond") {
          return {
            left: parentHeight / 4 + "px",
            top: parentHeight / 4 + 5 + "px",
            transform: "rotate(-45deg)",
          };
        } else {
          return {
            left: parentHeight / 4 + "px",
            top: parentHeight / 4 + "px",
            transform: "rotate(-45deg)",
          };
        }
      case "V1D2":
        if (parentType == "Bond") {
          return {
            right: parentHeight / 4 + "px",
            top: parentHeight / 4 + 5 + "px",
            transform: "rotate(45deg)",
          };
        } else {
          return {
            right: parentHeight / 4 + "px",
            top: parentHeight / 4 + "px",
            transform: "rotate(45deg)",
          };
        }
      case "V2D1":
        if (parentType == "Bond") {
          return {
            left: parentHeight / 4 - 2 + "px",
            top: parentHeight / 4 + 1 + "px",
            transform: "rotate(-45deg)",
          };
        } else {
          return {
            left: parentHeight / 4 - 3 + "px",
            top: parentHeight / 4 - 3 + "px",
            transform: "rotate(-45deg)",
          };
        }
      case "V2D2":
        if (parentType == "Bond") {
          return {
            right: parentHeight / 4 - 2 + "px",
            top: parentHeight / 4 + 1 + "px",
            transform: "rotate(45deg)",
          };
        } else {
          return {
            right: parentHeight / 4 - 3 + "px",
            top: parentHeight / 4 - 3 + "px",
            transform: "rotate(45deg)",
          };
        }
      default:
        return {};
    }
  };

  return (
    <div
      className={"bondLine"}
      id={"bondLine_" + lineType}
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
        {
          <line
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke={color}
            strokeWidth={4}
          />
        }
        {renderExtraLine(lineType)}
      </svg>
    </div>
  );
};

export default BondLine;

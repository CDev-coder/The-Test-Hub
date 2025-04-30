import { useState, useRef, useEffect } from "react";
import shadow from "../assets/Body_Shadow.svg";
import FrontSVG from "../assets/Body_F.svg?react";
import BackSVG from "../assets/Body_B.svg?react";
import { useMuscleData } from "../hooks/useMuscleData"; // Import the hook

const TypedFrontSVG = FrontSVG as React.FC<React.SVGProps<SVGSVGElement>>;
const TypedBackSVG = BackSVG as React.FC<React.SVGProps<SVGSVGElement>>;

type MuscleGroupProps = {
  size: string;
  isMobile: boolean;
};

export const MuscleGroup = ({}: MuscleGroupProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [infoBoxPosition, setInfoBoxPosition] = useState<{
    top: number;
    left?: number;
    right?: number;
    muscleGroup: string;
  }>({ top: 0, left: 0, muscleGroup: "front", right: 0 });
  const originalColors = useRef<Map<string, string>>(new Map());

  const frontRef = useRef<SVGSVGElement | null>(null);
  const backRef = useRef<SVGSVGElement | null>(null);

  // Use the hook to fetch muscle data based on hoveredId
  const { data, isLoading, error } = useMuscleData(hoveredId);

  const handleEnter = (svgLayer: string, group: SVGGElement) => {
    const id = group.getAttribute("class");
    if (!id) return;
    console.log(group);

    setHoveredId(id);

    // Get the bounding box of the group element to position the info box
    const rect = group.getBoundingClientRect();

    if (svgLayer == "frontGroup") {
      console.log("L p: ", rect.right + rect.width / 2);
      setInfoBoxPosition({
        top: rect.top - 70,
        left: rect.right + rect.width / 2,
        muscleGroup: "front",
      });
    } else {
      console.log("R p: ", rect.left);
      setInfoBoxPosition({
        top: rect.top - 70,
        left: rect.left - (rect.width + 200),
        muscleGroup: "back",
      });
    }

    const originalColor = group.getAttribute("fill");
    if (originalColor && !originalColors.current.has(id)) {
      originalColors.current.set(id, originalColor);
    }

    group.setAttribute("fill", "#ADD8E6"); // Light blue on hover
    (group as unknown as HTMLElement).style.cursor = "pointer";
  };

  const handleLeave = (group: SVGGElement) => {
    const id = group.getAttribute("class");
    if (!id) return;

    setHoveredId(null);

    const originalColor = originalColors.current.get(id);
    if (originalColor) {
      group.setAttribute("fill", originalColor);
      originalColors.current.delete(id);
    }
  };

  const attachHoverListeners = (
    svgRef: React.RefObject<SVGSVGElement | null>
  ) => {
    const svg = svgRef.current;
    if (!svg) return;
    console.log("svg", svg.id);
    const groups = svg.querySelectorAll("g[id]");
    const enterHandlers: { group: Element; handler: EventListener }[] = [];
    const leaveHandlers: { group: Element; handler: EventListener }[] = [];

    groups.forEach((group) => {
      const enter = () => handleEnter(svg.id, group as SVGGElement);
      const leave = () => handleLeave(group as SVGGElement);

      group.addEventListener("pointerenter", enter);
      group.addEventListener("pointerleave", leave);
      (group as HTMLElement).style.cursor = "pointer";

      enterHandlers.push({ group, handler: enter });
      leaveHandlers.push({ group, handler: leave });
    });

    return () => {
      enterHandlers.forEach(({ group, handler }) =>
        group.removeEventListener("pointerenter", handler)
      );
      leaveHandlers.forEach(({ group, handler }) =>
        group.removeEventListener("pointerleave", handler)
      );
    };
  };

  useEffect(() => {
    const cleanupFront = attachHoverListeners(frontRef);
    const cleanupBack = attachHoverListeners(backRef);
    return () => {
      cleanupFront?.();
      cleanupBack?.();
    };
  }, []);

  return (
    <div className="muscleContainer_parent">
      <div className="muscleContainer_child" id="frontGroup">
        <div className="muscleLabel">Front</div>

        <img src={shadow} className="bodyLayer scaledImage" alt="shadow" />
        <div className="muscleLayer">
          <TypedFrontSVG ref={frontRef} />
        </div>
      </div>
      <div className="muscleContainer_child" id="backGroup">
        <div className="muscleLabel">Back</div>
        <img src={shadow} className="bodyLayer scaledImage" alt="shadow" />
        <div className="muscleLayer">
          <TypedBackSVG ref={backRef} />
        </div>
      </div>
      {hoveredId && (
        <div
          className="muscleInfoBox"
          style={
            infoBoxPosition.muscleGroup == "front"
              ? {
                  top: `${infoBoxPosition.top}px`,
                  left: `${infoBoxPosition.left}px`,
                }
              : {
                  top: `${infoBoxPosition.top}px`,
                  left: `${infoBoxPosition.left}px`,
                }
          }
        >
          {isLoading && <p>Loading muscle info...</p>}
          {error && <p>Error: {(error as Error).message}</p>}
          {data && (
            <>
              <h3>{data.name}</h3>
              <ul>
                {data.exercises.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

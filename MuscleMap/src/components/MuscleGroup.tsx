import { useState, useRef, useEffect } from "react";
import shadow from "../assets/Body_Shadow.svg";
import FrontSVG from "../assets/Body_F.svg?react";
import BackSVG from "../assets/Body_B.svg?react";
import { useMuscleData } from "../hooks/useMuscleData"; // Import the hook
import useIsMobile from "../utils/useIsMobile";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useGesture } from "@use-gesture/react";

const TypedFrontSVG = FrontSVG as React.FC<React.SVGProps<SVGSVGElement>>;
const TypedBackSVG = BackSVG as React.FC<React.SVGProps<SVGSVGElement>>;

type MuscleGroupProps = {
  size: string;
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
  const touchTimer = useRef<number | null>(null);
  ///Find if mobile
  const isMobile = useIsMobile();
  const currentBodyView = useSelector(
    (state: RootState) => state.view.currentBodyView
  );

  // Use the hook to fetch muscle data based on hoveredId
  const { data, isLoading, error } = useMuscleData(hoveredId);

  const handleEnter = (svgLayer: string, group: SVGGElement) => {
    console.log("handleEnter");
    console.log("HE group: ", group);

    const id = group.getAttribute("class");
    console.log("HE id: ", id);
    if (!id) return;
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

  const attachHoverListeners = (svgRef: any) => {
    const svg = svgRef.current;
    if (!svg) return;

    const groups = svg.querySelectorAll("g[id]");
    const handlers: (() => void)[] = [];

    groups.forEach((group: SVGGElement) => {
      // Ensure the group can receive pointer events
      group.setAttribute("pointer-events", "all");

      // Mouse enter/leave
      const onPointerEnter = (e: { pointerType: string }) => {
        if (e.pointerType === "mouse") {
          handleEnter(svg.id, group);
        }
      };

      const onPointerLeave = (e: { pointerType: string }) => {
        if (e.pointerType === "mouse") {
          handleLeave(group);
        }
      };

      // Touch start
      const onTouchStart = (e: { preventDefault: () => void }) => {
        console.log("TOUCHING BOD");
        e.preventDefault();
        handleEnter(svg.id, group);
        setTimeout(() => {
          handleLeave(group);
        }, 1500);
      };

      group.addEventListener("pointerenter", onPointerEnter);
      group.addEventListener("pointerleave", onPointerLeave);
      group.addEventListener("touchstart", onTouchStart, { passive: false });

      handlers.push(() => {
        group.removeEventListener("pointerenter", onPointerEnter);
        group.removeEventListener("pointerleave", onPointerLeave);
        group.removeEventListener("touchstart", onTouchStart);
      });
    });

    // Return a cleanup function
    return () => {
      handlers.forEach((removeHandler) => removeHandler());
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

  // Helper to find which SVG contains the muscle group
  const getSvgId = (group: SVGGElement): string => {
    return group.closest("svg")?.id || "";
  };

  // Create a single gesture configuration
  const bind = useGesture({
    onHover: ({ hovering, event }) => {
      console.log("ON HOVER");
      const target = (event?.target as HTMLElement)
        ?.parentElement as unknown as SVGGElement;
      if (!target?.tagName || target.tagName !== "g") return;

      if (hovering) {
        handleEnter(getSvgId(target), target);
      } else {
        handleLeave(target);
      }
    },
    onTouchStart: ({ event }) => {
      console.log("ON onTouchStart");
      event.preventDefault();
      console.log("event?.target", event);
      const target = (event?.target as HTMLElement)
        ?.parentElement as unknown as SVGGElement;
      if (!target?.tagName || target.tagName !== "g") return;

      handleEnter(getSvgId(target), target);
      if (touchTimer.current) clearTimeout(touchTimer.current);
      touchTimer.current = window.setTimeout(() => {
        handleLeave(target);
      }, 1500);
    },
  });

  useEffect(() => {
    const applyBindings = (svg: SVGSVGElement) => {
      // Get all direct child elements of the SVG
      const groups = svg.querySelectorAll(
        ":scope > g"
      ) as NodeListOf<SVGGElement>;
      const gestureProps = bind();

      groups.forEach((group) => {
        Object.entries(gestureProps).forEach(([event, handler]) => {
          if (typeof handler === "function") {
            const eventName = event.toLowerCase().replace(/^on/, "");
            group.addEventListener(
              eventName,
              handler as unknown as EventListener
            );
          }
        });
      });

      return () => {
        groups.forEach((group) => {
          Object.entries(gestureProps).forEach(([event, handler]) => {
            if (typeof handler === "function") {
              const eventName = event.toLowerCase().replace(/^on/, "");
              group.removeEventListener(
                eventName,
                handler as unknown as EventListener
              );
            }
          });
        });
      };
    };

    const cleanups: (() => void)[] = [];
    if (frontRef.current) cleanups.push(applyBindings(frontRef.current));
    if (backRef.current) cleanups.push(applyBindings(backRef.current));

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [bind]);

  return (
    <div className="muscleContainer_parent">
      {isMobile && (
        <>
          {currentBodyView === "front" && (
            <div className="muscleContainer_child" id="frontGroup">
              <div className="muscleLabel">Front</div>
              <img
                src={shadow}
                className="bodyLayer scaledImage"
                alt="shadow"
              />
              <div className="muscleLayer">
                <TypedFrontSVG ref={frontRef} />
              </div>
            </div>
          )}
          {currentBodyView === "back" && (
            <div className="muscleContainer_child" id="backGroup">
              <div className="muscleLabel">Back</div>
              <img
                src={shadow}
                className="bodyLayer scaledImage"
                alt="shadow"
              />
              <div className="muscleLayer">
                <TypedBackSVG ref={backRef} />
              </div>
            </div>
          )}
        </>
      )}
      {!isMobile && (
        <>
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
        </>
      )}

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
                {data.fact.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
              <div>Excerises</div>
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

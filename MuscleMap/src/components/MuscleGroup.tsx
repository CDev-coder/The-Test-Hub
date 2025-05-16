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
    direction: string;
    distance: number;
  }>({
    direction: "left",
    distance: 0,
    top: 0,
  });

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

  const handleEnter = (group: SVGGElement, event: any) => {
    //console.log("handleEnter");
    const id = group.getAttribute("class");
    if (!id) return;
    setHoveredId(id);

    // Get the bounding box of the group element to position the info box
    const rect = group.getBoundingClientRect();

    if (isMobile) {
      const halfWidth = window.innerWidth / 2;
      const direction =
        event.changedTouches[0].pageX < halfWidth ? "left" : "right";
      const distance =
        direction == "left"
          ? event.changedTouches[0].pageX
          : event.changedTouches[0].pageX - (rect.width + 55);

      setInfoBoxPosition({
        top: event.changedTouches[0].pageY,
        direction: direction,
        distance: distance,
      });
    } else {
      const halfWidth = window.innerWidth / 2;
      const direction = event.pageX < halfWidth ? "left" : "right";
      const distance =
        direction == "left"
          ? event.pageX + rect.width / 2
          : window.innerWidth - event.pageX + rect.width;
      setInfoBoxPosition({
        top: event.pageY,
        direction: direction,
        distance: distance,
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
      group.setAttribute("pointer-events", "all");
      // Mouse enter/leave
      const onPointerEnter = (e: { pointerType: string }) => {
        if (e.pointerType === "mouse") {
          handleEnter(group, e);
        }
      };
      const onPointerLeave = (e: { pointerType: string }) => {
        if (e.pointerType === "mouse") {
          handleLeave(group);
        }
      };
      group.addEventListener("pointerenter", onPointerEnter);
      group.addEventListener("pointerleave", onPointerLeave);
      handlers.push(() => {
        group.removeEventListener("pointerenter", onPointerEnter);
        group.removeEventListener("pointerleave", onPointerLeave);
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

  // Create a single gesture configuration
  const bind = useGesture({
    onHover: ({ hovering, event }) => {
      const target = (event?.target as HTMLElement)
        ?.parentElement as unknown as SVGGElement;
      if (!target?.tagName || target.tagName !== "g") return;
      if (hovering) {
        handleEnter(target, event);
      } else {
        handleLeave(target);
      }
    },
    onTouchStart: ({ event }) => {
      event.preventDefault();
      const target = (event?.target as HTMLElement)
        ?.parentElement as unknown as SVGGElement;
      if (!target?.tagName || target.tagName !== "g") return;

      handleEnter(target, event);
      if (touchTimer.current) clearTimeout(touchTimer.current);
      touchTimer.current = window.setTimeout(() => {
        handleLeave(target);
      }, 2000);
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
          style={{
            top: `${infoBoxPosition.top}px`,
            [infoBoxPosition.direction]: `${infoBoxPosition.distance}px`,
          }}
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

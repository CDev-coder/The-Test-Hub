import { useDispatch } from "react-redux";
import { toggleView } from "../store/viewStore";
import useIsMobile from "../utils/useIsMobile";

export const MobileFixedButton = () => {
  const dispatch = useDispatch();

  const isMobile = useIsMobile;
  if (!isMobile) return null;

  return (
    <div className="mobileButtonWrapper">
      <button
        className="bodyButton"
        onClick={(e) => {
          console.log("BUTTON CLICKED");
          e.stopPropagation();
          dispatch(toggleView());
        }}
      >
        View
      </button>
    </div>
  );
};

import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(ref, close, extraRefs) { // extraRefs - refs outside main ref, that wouldn't trigger "close" function
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (!ref.current || ref.current.contains(event.target) || extraRefs?.some((ref) => ref?.current?.contains(event.target))) return
      close()
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideAlerter({close, extraRefs, children}) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, close, extraRefs);

  return <div ref={wrapperRef}>{children}</div>;
}

OutsideAlerter.propTypes = {
  children: PropTypes.element.isRequired
};

export default OutsideAlerter;

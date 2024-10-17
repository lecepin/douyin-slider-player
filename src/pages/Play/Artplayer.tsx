import { useEffect, useRef } from "react";
import Artplayer from "artplayer";

// @ts-ignore
export default function Player({ option, getInstance, ...rest }) {
  const artRef = useRef(null);

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, []);

  return <div ref={artRef} {...rest}></div>;
}

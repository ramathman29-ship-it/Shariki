import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to the top on navigation, or to the #section in the URL. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // wait a frame so lazy pages have rendered the target
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" })
      );
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

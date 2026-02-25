import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import AppRoutes from "./routes/AppRoutes";

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      offset: 120,
      easing: "ease-in-out",
    });
  }, []);

  return <AppRoutes />;
}

import { HelloVolvoCarWorld } from "../src/components/HelloVolvoCarWorld";
import "../public/css/styles.css";
import React from "react";

function HomePage() {
  return (
    <React.StrictMode>
      <HelloVolvoCarWorld />
    </React.StrictMode>
  );
}

export default HomePage;

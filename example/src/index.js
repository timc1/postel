import * as React from "react";
import { render } from "react-dom";
import Demo from "./Demo";

const node = document.getElementById("root");

if (node) {
  render(<Demo />, node);
}

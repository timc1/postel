import * as React from "react";

const style = {
  position: "fixed" as any,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 80,
  display: "block",
  cursor: "default",
  background: "transparent",
};

export default function TransparentUnderlay() {
  return <div style={style} />;
}

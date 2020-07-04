import * as React from "react";
import ReactDOM = require("react-dom");

export default function Portal(props: {
  children: React.ReactNode;
  onReady?: () => void;
}) {
  const portalNode = React.useRef<HTMLDivElement | null>(null);
  const mountNode = React.useRef<HTMLDivElement | null>(null);
  const [isReady, setReady] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!mountNode.current) {
      return;
    }

    const ownerDocument = mountNode.current.ownerDocument;

    if (ownerDocument) {
      portalNode.current = ownerDocument.createElement("div");
      ownerDocument.body.appendChild(portalNode.current);
      setReady(true);
    }

    return () => {
      if (portalNode.current && ownerDocument) {
        ownerDocument.body.removeChild(portalNode.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (isReady && props.onReady) {
      props.onReady();
    }
  }, [isReady]);

  return portalNode.current ? (
    ReactDOM.createPortal(props.children, portalNode.current)
  ) : (
    <span ref={mountNode} />
  );
}

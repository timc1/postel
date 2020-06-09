import * as React from "react";
import * as ReactDOM from "react-dom";
import { Props } from "../index";

const PORTAL_ID = "tooltip";

export default function Tooltip(props: Props) {
  const [isShowing, setShowing] = React.useState(false);
  const toggleRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLElement | null>(null);
  const caretRef = React.useRef<HTMLElement | null>(null);
  const timeout = React.useRef<any>();
  // A unique id will enable the usage of multiple Tooltips
  // on the screen with various show/hide triggers.
  const id = React.useRef(
    PORTAL_ID + "-" + Math.random().toString(36).substring(2, 15)
  );

  // Setup listeners
  React.useEffect(() => {
    const toggle = toggleRef.current;
    const node = document.createElement("div");
    node.setAttribute("id", id.current);
    node.setAttribute("role", "tooltip");
    node.style.position = "absolute";
    node.style.top = "0";
    node.style.left = "0";
    node.style.zIndex = "1";

    const cleanupPortal = () => {
      if (document.body.contains(node)) {
        document.body.removeChild(node);
      }
    };

    const setupPortal = () => {
      cleanupPortal();
      document.body.appendChild(node);
    };

    const handleMouseEnter = () => {
      clearTimeout(timeout.current);

      const delay = props.showDelay || 0;

      if (delay > 0) {
        timeout.current = setTimeout(() => {
          setupPortal();
          setShowing(true);
        }, delay);
      } else {
        setupPortal();
        setShowing(true);
      }
    };

    const handleMouseLeave = () => {
      clearTimeout(timeout.current);

      const delay = props.leaveDelay || 0;

      if (delay > 0) {
        timeout.current = setTimeout(() => {
          cleanupPortal();
          setShowing(false);
        }, delay);
      } else {
        cleanupPortal();
        setShowing(false);
      }
    };

    const handleClick = (event: MouseEvent) => {
      // preventDefault and stopPropagation to make sure this click goes through
      // and handleOuterClick, if set, will not be called at this time.
      event.preventDefault();
      event.stopPropagation();

      clearTimeout(timeout.current);

      setupPortal();
      setShowing(true);
    };

    const handleOuterClick = (event: MouseEvent) => {
      clearTimeout(timeout.current);

      const content = contentRef.current;
      const target = event.target;

      if (content && !content.contains(target as any)) {
        cleanupPortal();
        setShowing(false);
      }
    };

    const handleMouseLeaveContent = (event: MouseEvent) => {
      clearTimeout(timeout.current);

      // 50ms allows enough time for a user to mouseover from the toggle to the content.
      // Otherwise, an immediate calculation is too quick and the slight gap between the
      // toggle and will remove the content.
      const delay =
        props.leaveDelay && props.leaveDelay > 50 ? props.leaveDelay : 50;
      const target = event.target as any;
      const content = contentRef.current;
      const caret = caretRef.current;

      if (delay) {
        timeout.current = setTimeout(() => {
          if (toggle && content) {
            if (
              toggle.contains(target) ||
              content.contains(target) ||
              content.contains(caret)
            ) {
              return;
            }

            cleanupPortal();
            setShowing(false);
          }
        }, delay);
      }
    };

    if (toggle) {
      const showTrigger = props.showTrigger || "hover";
      const leaveTrigger = props.leaveTrigger || "mouseleave";

      if (showTrigger === "hover") {
        toggle.addEventListener("mouseenter", handleMouseEnter);
      }

      if (showTrigger === "click") {
        toggle.addEventListener("click", handleClick);
      }

      if (leaveTrigger === "mouseleave") {
        toggle.addEventListener("mouseleave", handleMouseLeave);
      }

      if (leaveTrigger === "click") {
        window.addEventListener("click", handleOuterClick);
      }

      if (leaveTrigger === "mouseleave-content") {
        window.addEventListener("mouseover", handleMouseLeaveContent);
      }
    }

    return () => {
      // Cleanup
      if (toggle) {
        toggle.removeEventListener("mouseenter", handleMouseEnter);
        toggle.removeEventListener("click", handleClick);
        toggle.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("click", handleOuterClick);
      window.removeEventListener("mouseover", handleMouseLeaveContent);
      clearTimeout(timeout.current);
      cleanupPortal();
    };
  }, [
    props.showTrigger,
    props.leaveTrigger,
    props.showDelay,
    props.leaveDelay,
  ]);

  React.useEffect(() => {
    const content = contentRef.current;
    const toggle = toggleRef.current;
    const caret = caretRef.current;
    const {
      x: docX,
      y: docY,
    } = document.documentElement.getBoundingClientRect();

    const positionContent = () => {
      if (toggle && content) {
        const position = {
          x: 0,
          y: 0,
        };

        const caretPosition = {
          x: 0,
          y: 0,
        };

        const {
          height: contentHeight,
          width: contentWidth,
        } = content.getBoundingClientRect();

        const {
          height: toggleHeight,
          width: toggleWidth,
          x,
          y,
        } = toggle.getBoundingClientRect();

        const halfOfToggle = toggleWidth / 2;
        // x axis left of toggle.
        const toggleX = x - docX;
        // y axis currently directly top of the toggle.
        const toggleY = y - docY;

        const placement = props.placement;

        let caretHeight = 0;

        if (caret) {
          const { height } = caret.getBoundingClientRect();
          caretHeight = height;
        }

        const halfCaret = caretHeight * 0.5;

        // Shared variables for top-start, top-end, bottom-start, etc.
        const top = toggleY - contentHeight - halfCaret;
        const bottom = toggleY + toggleHeight + halfCaret;
        const center = (position.x = toggleX + halfOfToggle - contentWidth / 2);
        const end = toggleX + toggleWidth - contentWidth;

        let autoPlacement;

        if (placement === "auto") {
          // Precendence goes — top, top-left/top-right --> bottom, bottom-left/bottom-right.
          // Here we determine where to place the tooltip based on the above precendence and
          // the content's would-be position on the screen.

          const { scrollY, innerWidth } = window;
          const relativeTop = top - scrollY;
          const halfContentWidth = contentWidth / 2;

          if (relativeTop > 0) {
            autoPlacement = "top";
          } else {
            autoPlacement = "bottom";
          }

          const spaceOnLeftIfCenter = center;
          const spaceOnRightIfCenter =
            innerWidth -
            (toggleX + toggleWidth) -
            (halfContentWidth - halfOfToggle);

          // If one of the sides, if selected, will overflow off the page.
          // If both sides don't fit, just place the content centered.

          if (
            (spaceOnLeftIfCenter < 0 || spaceOnRightIfCenter < 0) &&
            !(spaceOnLeftIfCenter < 0 && spaceOnRightIfCenter < 0)
          ) {
            // Whichever side has more spacing is the side we'll prefer.
            const preferredSide =
              spaceOnLeftIfCenter > spaceOnRightIfCenter ? "end" : "start";

            autoPlacement = autoPlacement.concat(`-${preferredSide}`);
          }
        }

        // Default caretPosition to top, override down below.
        caretPosition.x = toggleX + halfOfToggle;

        switch (autoPlacement || placement) {
          case "top": {
            position.x = center;
            position.y = top;
            caretPosition.y = toggleY - caretHeight;
            break;
          }
          case "top-end": {
            position.x = end;
            position.y = top;
            caretPosition.y = toggleY - caretHeight;
            break;
          }
          case "top-start": {
            position.x = toggleX;
            position.y = top;
            caretPosition.y = toggleY - caretHeight;
            break;
          }
          case "bottom": {
            position.x = center;
            position.y = bottom;
            caretPosition.y = toggleY + toggleHeight;
            break;
          }
          case "bottom-end": {
            position.x = end;
            position.y = bottom;
            caretPosition.y = toggleY + toggleHeight;
            break;
          }
          case "bottom-start": {
            position.x = toggleX;
            position.y = bottom;
            caretPosition.y = toggleY + toggleHeight;
            break;
          }
          case "left": {
            position.x = toggleX - contentWidth - halfCaret;
            position.y = toggleY + toggleHeight / 2 - contentHeight / 2;
            caretPosition.x = toggleX - halfCaret;
            caretPosition.y = toggleY + toggleHeight / 2;
            break;
          }
          case "right": {
            position.x = toggleX + toggleWidth + halfCaret;
            position.y = toggleY + toggleHeight / 2 - contentHeight / 2;
            caretPosition.x = toggleX + toggleWidth + caretHeight;
            caretPosition.y = toggleY + toggleHeight / 2;
            break;
          }
        }

        if (caret) {
          let transformOrigin = "0 0";
          let rotate = "45deg";

          // @ts-ignore
          if ((autoPlacement || placement).includes("bottom")) {
            transformOrigin = "30% 70%";
            rotate = "225deg";
          }

          if ((autoPlacement || placement) === "left") {
            transformOrigin = "-50% 100%";
            rotate = "-45deg";
          }

          if ((autoPlacement || placement) === "right") {
            transformOrigin = "0 0";
            rotate = "-225deg";
          }

          caret.style.transform = `translate3d(${caretPosition.x}px, ${caretPosition.y}px, 0) rotate(${rotate})`;
          caret.style.transformOrigin = "30% 70%";
          caret.style.transformOrigin = transformOrigin;
          caret.style.opacity = "1";
        }

        content.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
        content.style.opacity = "1";

        return position;
      }
    };

    if (isShowing) {
      window.addEventListener("resize", positionContent);
      positionContent();
    }

    return () => {
      // Cleanup
      window.removeEventListener("resize", positionContent);
    };
  }, [isShowing, props.placement, props.title]);

  const mapRefToChild = (child: any, ref: any, props?: Object) => {
    return React.cloneElement(child, { ref, ...props });
  };

  return (
    <>
      {mapRefToChild(props.children, toggleRef)}
      {isShowing &&
        ReactDOM.createPortal(
          <div>
            {mapRefToChild(
              props.content ? (
                // Make sure that if your content is a React component, wrap it
                // in React.forwardRef in order for Tooltip's ref to pass through
                props.content
              ) : (
                <div>{props.title}</div>
              ),
              contentRef,
              {
                title: props.title,
                style: {
                  // This ensures that we never get a second of flashing from the top left
                  // to when the node gets transformed to its position.
                  opacity: 0,
                  ...defaultContentStyles,
                  ...props.customContentStyles,
                },
              }
            )}
            {!props.noCaret &&
              mapRefToChild(<div />, caretRef, {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                  ...defaultCaretStyles,
                  ...props.customCaretStyles,
                },
              })}
          </div>,
          // @ts-ignore
          document.getElementById(id.current)
        )}
    </>
  );
}

const defaultCaretStyles = {
  height: 10,
  width: 10,
  background: "#fff",
  boxShadow: "1px 1px 0 1px rgba(0, 0, 0, 0.02)",
  borderBottomRightRadius: "4px",
  transform: "rotate(45deg)",
};

const defaultContentStyles = {
  padding: "8px",
  background: "#fff",
  boxShadow:
    "0 0 0 1px rgba(136, 152, 170, 0.1), 0 15px 35px 0 rgba(49, 49, 93, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.08)",
  borderRadius: "4px",
  fontSize: "14px",
};

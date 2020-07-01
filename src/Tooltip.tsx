import * as React from "react";
import ReactDOM = require("react-dom");
import {
  Props,
  State,
  ContentPosition,
  CaretPosition,
  Position,
  Placement,
} from "../index";

type Action =
  | {
      type: "TOGGLE_SHOW";
      payload: {
        activeElement: HTMLElement;
      };
    }
  | {
      type: "TOGGLE_HIDE";
    }
  | { type: "SET_LEAVE_TRANSITION" }
  | {
      type: "SET_POSITION";
      payload: Position;
    }
  | {
      type: "UPDATE_PLACEMENT";
      payload: Placement;
    };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "TOGGLE_SHOW":
      return {
        ...state,
        isShowing: true,
        isTransitioningOut: false,
        activeElement: action.payload.activeElement,
      };
    case "TOGGLE_HIDE":
      return {
        ...state,
        isShowing: false,
        isShowingContent: false,
        isTransitioningOut: false,
        activeElement: null,
      };
    case "SET_POSITION": {
      return {
        ...state,
        contentPosition: action.payload.content,
        caretPosition: action.payload.caret,
        isShowingContent: true,
      };
    }
    case "UPDATE_PLACEMENT": {
      return {
        ...state,
        placement: action.payload,
      };
    }
    case "SET_LEAVE_TRANSITION": {
      return {
        ...state,
        isTransitioningOut: true,
      };
    }
  }
}

export default function Tooltip(props: Props) {
  const initialState: State = {
    isShowing: false,
    isShowingContent: false,
    isTransitioningOut: false,
    contentPosition: { x: 0, y: 0 },
    caretPosition: { x: 0, y: 0, transformOrigin: "0 0 ", rotate: "45deg" },
    placement: props.placement || "auto",
    activeElement: null,
  };

  const timeout = React.useRef<any>(null);
  const toggleRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLElement | null>(null);
  const caretRef = React.useRef<HTMLElement | null>(null);
  const id = React.useRef(
    "tooltip-" + Math.random().toString(36).substring(2, 15)
  );

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { showTrigger = "hover", leaveTrigger = "mouseleave" } = props;

  const calculateContentPosition: () => Position = React.useCallback(() => {
    const content = contentRef.current;
    const toggle = toggleRef.current;
    const caret = caretRef.current;

    const position: Position = {
      content: {
        x: 0,
        y: 0,
      },
      caret: {
        x: 0,
        y: 0,
        transformOrigin: "0 0",
        rotate: "45deg",
      },
    };

    if (content && toggle) {
      // Document position.
      const {
        x: docX,
        y: docY,
      } = document.documentElement.getBoundingClientRect();

      // Content size.
      const {
        height: contentHeight,
        width: contentWidth,
      } = content.getBoundingClientRect();

      // Toggle position & size.
      const {
        height: toggleHeight,
        width: toggleWidth,
        x,
        y,
      } = toggle.getBoundingClientRect();

      const halfWidthOfToggle = toggleWidth / 2;

      // X axis left of toggle.
      const toggleX = x - docX;

      // Y axis currently directly top of the toggle.
      const toggleY = y - docY;

      let caretHeight = 0;

      if (caret) {
        const { height } = caret.getBoundingClientRect();
        caretHeight = height;
      }

      let halfHeightOfCaret = caretHeight ? caretHeight * 0.5 : 0;

      const top = toggleY - contentHeight - halfHeightOfCaret;
      const bottom = toggleY + toggleHeight + halfHeightOfCaret;
      const center = toggleX + halfWidthOfToggle - contentWidth / 2;
      const end = toggleX + toggleWidth - contentWidth;

      let placement = props.placement || "auto";

      if (placement === "auto") {
        // Precendence goes — top, top-left/top-right --> bottom, bottom-left/bottom-right.
        // Here we determine where to place the tooltip based on the above precendence and
        // the content's would-be position on the screen.

        const { scrollY, innerWidth } = window;
        const relativeTop = top - scrollY;
        const halfContentWidth = contentWidth / 2;

        if (relativeTop > 0) {
          placement = "top";
        } else {
          placement = "bottom";
        }

        const spaceOnLeftIfCenter = center;
        const spaceOnRightIfCenter =
          innerWidth -
          (toggleX + toggleWidth) -
          (halfContentWidth - halfWidthOfToggle);

        // If one of the sides, if selected, will overflow off the page.
        // If both sides don't fit, just place the content centered.

        if (
          (spaceOnLeftIfCenter < 0 || spaceOnRightIfCenter < 0) &&
          !(spaceOnLeftIfCenter < 0 && spaceOnRightIfCenter < 0)
        ) {
          // Whichever side has more spacing is the side we'll prefer.
          const preferredSide =
            spaceOnLeftIfCenter > spaceOnRightIfCenter ? "end" : "start";

          placement = placement.concat(`-${preferredSide}`) as Placement;
        }
      }

      dispatch({
        type: "UPDATE_PLACEMENT",
        payload: placement,
      });

      position.caret.x = toggleX + halfWidthOfToggle;

      switch (placement) {
        case "top": {
          position.content.x = center;
          position.content.y = top;
          position.caret.y = toggleY - caretHeight;
          break;
        }
        case "top-end": {
          position.content.x = end;
          position.content.y = top;
          position.caret.y = toggleY - caretHeight;
          break;
        }
        case "top-start": {
          position.content.x = toggleX;
          position.content.y = top;
          position.caret.y = toggleY - caretHeight;
          break;
        }
        case "bottom": {
          position.content.x = center;
          position.content.y = bottom;
          position.caret.y = toggleY + toggleHeight;
          break;
        }
        case "bottom-end": {
          position.content.x = end;
          position.content.y = bottom;
          position.caret.y = toggleY + toggleHeight;
          break;
        }
        case "bottom-start": {
          position.content.x = toggleX;
          position.content.y = bottom;
          position.caret.y = toggleY + toggleHeight;
          break;
        }
        case "left": {
          position.content.x = toggleX - contentWidth - halfHeightOfCaret;
          position.content.y = toggleY + toggleHeight / 2 - contentHeight / 2;
          position.caret.x = toggleX - halfHeightOfCaret;
          position.caret.y = toggleY + toggleHeight / 2;
          break;
        }
        case "right": {
          position.content.x = toggleX + toggleWidth + halfHeightOfCaret;
          position.content.y = toggleY + toggleHeight / 2 - contentHeight / 2;
          position.caret.x = toggleX + toggleWidth + caretHeight;
          position.caret.y = toggleY + toggleHeight / 2;
          break;
        }
      }

      if (caret) {
        let transformOrigin = "0 0";
        let rotate = "45deg";

        if (placement.includes("bottom")) {
          transformOrigin = "30% 70%";
          rotate = "225deg";
        }

        if (placement === "left") {
          transformOrigin = "-50% 100%";
          rotate = "-45deg";
        }

        if (placement === "right") {
          transformOrigin = "0 0";
          rotate = "-225deg";
        }

        position.caret.transformOrigin = transformOrigin;
        position.caret.rotate = rotate;
      }
    }

    return position;
  }, [props.placement]);

  const show = React.useCallback(() => {
    // 1. Add portal node into the DOM.
    const node = document.getElementById(id.current);

    if (!node) {
      const node = document.createElement("div");
      node.setAttribute("id", id.current);
      document.body.appendChild(node);
    }

    const setShow = () => {
      dispatch({
        type: "TOGGLE_SHOW",
        payload: {
          activeElement: document.activeElement as HTMLElement,
        },
      });
    };

    if (props.showDelay) {
      timeout.current = setTimeout(setShow, props.showDelay);
    } else {
      setShow();
    }
  }, [props.showDelay]);

  const hide = React.useCallback(() => {
    const actuallyHide = () => {
      // Set focus back on where the user was previously.
      if (state.activeElement && !props.preventAutoFocus) {
        state.activeElement.focus();
      }

      const node = document.getElementById(id.current);

      if (node) {
        document.body.removeChild(node);
      }
      dispatch({
        type: "TOGGLE_HIDE",
      });
    };

    const triggerHide = () => {
      if (props.leaveDelay) {
        timeout.current = setTimeout(actuallyHide, props.leaveDelay);
      } else {
        actuallyHide();
      }
    };

    if (props.leaveTransitionMs) {
      dispatch({
        type: "SET_LEAVE_TRANSITION",
      });

      timeout.current = setTimeout(() => {
        triggerHide();
      }, props.leaveTransitionMs);
    } else {
      triggerHide();
    }
  }, [
    props.leaveDelay,
    props.leaveTransitionMs,
    state.activeElement,
    props.preventAutoFocus,
  ]);

  const positionNode = React.useCallback(() => {
    const position = calculateContentPosition();
    dispatch({
      type: "SET_POSITION",
      payload: position,
    });
  }, [calculateContentPosition]);

  React.useEffect(() => {
    const toggle = toggleRef.current;

    const handleMouseEnter = () => {
      clearTimeout(timeout.current);
      show();
    };

    const handleMouseLeave = () => {
      clearTimeout(timeout.current);
      hide();
    };

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      clearTimeout(timeout.current);
      show();
    };

    const handleOuterClick = (event: MouseEvent) => {
      const content = contentRef.current;
      const target = event.target;

      if (content && !content.contains(target as any)) {
        clearTimeout(timeout.current);
        hide();
      }
    };

    const handleMouseLeaveContent = (event: MouseEvent) => {
      const target = event.target as any;
      const content = contentRef.current;
      const caret = caretRef.current;

      // 100ms allows enough time for a user to mouseover from the toggle to the content.
      // Otherwise, an immediate calculation is too quick and the slight gap between the
      // toggle and will remove the content.
      const delay =
        props.leaveDelay && props.leaveDelay > 100 ? props.leaveDelay : 100;

      timeout.current = setTimeout(() => {
        if (toggle && content) {
          if (
            toggle.contains(target) ||
            content.contains(target) ||
            content.contains(caret) ||
            (caret && caret.contains(target))
          ) {
            return;
          }

          clearTimeout(timeout.current);
          hide();
        }
      }, delay);
    };

    const handleResize = () => {
      positionNode();
    };

    const setupListeners = () => {
      if (toggle) {
        // Show triggers
        if (showTrigger === "hover") {
          toggle.addEventListener("mouseenter", handleMouseEnter);
        }

        if (showTrigger === "click") {
          toggle.addEventListener("click", handleClick);
        }

        // Leave triggers
        if (leaveTrigger === "mouseleave") {
          toggle.addEventListener("mouseleave", handleMouseLeave);
        }

        if (leaveTrigger === "click" && state.isShowing) {
          window.addEventListener("click", handleOuterClick);
        }

        if (leaveTrigger === "mouseleave-content" && state.isShowing) {
          window.addEventListener("mouseover", handleMouseLeaveContent);
        }
      }

      if (state.isShowing) {
        window.addEventListener("resize", handleResize);
      }
    };

    setupListeners();

    const cleanupListeners = () => {
      if (toggle) {
        toggle.removeEventListener("mouseenter", handleMouseEnter);
        toggle.removeEventListener("mouseleave", handleMouseLeave);
        toggle.removeEventListener("click", handleClick);
      }
      window.removeEventListener("click", handleOuterClick);
      window.removeEventListener("mouseover", handleMouseLeaveContent);
      window.removeEventListener("resize", handleResize);
    };

    return () => {
      cleanupListeners();
    };
  }, [state.isShowing, showTrigger, leaveTrigger, show, positionNode]);

  React.useEffect(() => {
    if (state.isShowing) {
      positionNode();

      const content = contentRef.current;
      if (content && !props.preventAutoFocus) {
        content.tabIndex = 0;
        content.focus();
      }
    }
  }, [state.isShowing, props.title, positionNode]);

  const mapRefToChild = (child: any, ref: any, props?: any) => {
    return React.cloneElement(child, { ref, ...child.props, ...props });
  };

  const renderProps = {
    placement: state.placement,
    isTransitioningOut: state.isTransitioningOut,
    onRequestClose: hide,
  };

  return (
    <React.Fragment>
      {mapRefToChild(props.children, toggleRef)}
      {state.isShowing &&
        ReactDOM.createPortal(
          <React.Fragment>
            {props.showTransparentOverlay && <TransparentOverlay />}
            {props.content && (
              <Positioner
                position={state.contentPosition}
                isShowing={state.isShowingContent}
                role="tooltip"
                title={props.title}
              >
                {mapRefToChild(
                  typeof props.content === "function"
                    ? props.content(renderProps)
                    : props.content,
                  contentRef
                )}
              </Positioner>
            )}
            {props.caret && (
              <Positioner
                position={state.caretPosition}
                isShowing={state.isShowingContent}
              >
                {mapRefToChild(
                  typeof props.caret === "function"
                    ? props.caret(renderProps)
                    : props.caret,
                  caretRef
                )}
              </Positioner>
            )}
          </React.Fragment>,
          // @ts-ignore
          document.getElementById(id.current)
        )}
    </React.Fragment>
  );
}

type PositionerProps = {
  children?: React.ReactNode;
  position: ContentPosition | CaretPosition;
  isShowing: boolean;
  [k: string]: any;
};

function Positioner(props: PositionerProps) {
  const { position: pos, isShowing, ...rest } = props;
  const position = pos as any; // Uhh Typescript 🙈
  const translate = `translate3d(${position.x}px, ${position.y}px, 0px)`;
  const transform = position.rotate
    ? `${translate} rotate(${position.rotate})`
    : translate;

  const style = {
    position: "fixed" as any,
    top: "0",
    left: "0",
    transformOrigin: position.transformOrigin,
    transform,
    opacity: isShowing ? 1 : 0,
    zIndex: 99999,
  };
  return (
    <div style={style} {...rest}>
      {props.children}
    </div>
  );
}

function TransparentOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: "block",
        background: "transparent",
        cursor: "default",
        zIndex: 99998,
      }}
    ></div>
  );
}

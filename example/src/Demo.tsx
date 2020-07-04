import * as React from "react";
import "./index.css";
import Postel from "../../src/index";
import { Placement, Trigger, HideTrigger } from "../../index";
import { AnimatePresence, motion } from "framer-motion";

const placements: Placement[] = [
  "auto",
  "top",
  "top-end",
  "top-start",
  "bottom",
  "bottom-end",
  "bottom-start",
  "left",
  "right",
];

const showTriggers: Trigger[] = ["hover", "click", "mousedown"];

const leaveTriggers: HideTrigger[] = ["mouseleave", "click"];

const contentTypes = ["none", "custom"];

type State = {
  placement: Placement;
  showTrigger: Trigger;
  leaveTrigger: HideTrigger;
  triggerDelay?: number;
  hideDelay?: number;
  animated: boolean;
  title: string;
  content: "none" | "custom";
};

const initialState: State = {
  placement: "auto",
  showTrigger: "hover",
  leaveTrigger: "mouseleave",
  triggerDelay: undefined,
  hideDelay: undefined,
  animated: false,
  title: "This is a tooltip-like content",
  content: "none",
};

const reducer = (state: State, action: { [k: string]: any }) => {
  return {
    ...state,
    [action.key]: action.payload,
  };
};

export default function Demo() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <div className="container">
      <div className="header">
        <ul>
          <li>Placement</li>
          {placements.map((placement) => (
            <li key={placement}>
              <label htmlFor={placement}>
                <input
                  id={placement}
                  type="checkbox"
                  checked={state.placement === placement}
                  onChange={() =>
                    dispatch({
                      key: "placement",
                      payload: placement,
                    })
                  }
                />
                {placement}
              </label>
            </li>
          ))}
        </ul>
        <ul>
          <li>Show trigger</li>
          {showTriggers.map((showTrigger) => (
            <li key={`showTrigger-${showTrigger}`}>
              <label htmlFor={`showTrigger-${showTrigger}`}>
                <input
                  id={`showTrigger-${showTrigger}`}
                  type="checkbox"
                  checked={state.showTrigger === showTrigger}
                  onChange={() =>
                    dispatch({
                      key: "showTrigger",
                      payload: showTrigger,
                    })
                  }
                />
                {showTrigger}
              </label>
            </li>
          ))}
        </ul>
        <ul>
          <li>Leave trigger</li>
          {leaveTriggers.map((leaveTrigger) => (
            <li key={`leaveTrigger-${leaveTrigger}`}>
              <label htmlFor={`leaveTrigger-${leaveTrigger}`}>
                <input
                  id={`leaveTrigger-${leaveTrigger}`}
                  type="checkbox"
                  checked={state.leaveTrigger === leaveTrigger}
                  onChange={() =>
                    dispatch({
                      key: "leaveTrigger",
                      payload: leaveTrigger,
                    })
                  }
                />
                {leaveTrigger}
              </label>
            </li>
          ))}
        </ul>
        <ul>
          <li>Content</li>
          {contentTypes.map((content) => (
            <li key={content}>
              <label htmlFor={content}>
                <input
                  id={content}
                  type="checkbox"
                  checked={state.content === content}
                  onChange={() => {
                    dispatch({
                      key: "content",
                      payload: content,
                    });
                  }}
                />
                {content}
              </label>
            </li>
          ))}
        </ul>
        <ul>
          <li>
            <p>Show Delay (ms)</p>
          </li>
          <li>
            <input
              type="number"
              value={state.triggerDelay}
              onChange={(event) => {
                dispatch({
                  key: "triggerDelay",
                  payload: event.target.value,
                });
              }}
            />
          </li>
          <li>
            <p>Leave Delay (ms)</p>
          </li>
          <li>
            <input
              type="number"
              value={state.hideDelay}
              onChange={(event) => {
                dispatch({
                  key: "hideDelay",
                  payload: event.target.value,
                });
              }}
            />
          </li>
        </ul>
        <ul>
          <li>
            <p>Animation</p>
          </li>
          <li>
            <label htmlFor="animated">
              <input
                id="animated"
                type="checkbox"
                checked={state.animated}
                onChange={() => {
                  dispatch({
                    key: "animated",
                    payload: !state.animated,
                  });
                }}
              />
              Animated
            </label>
          </li>
        </ul>
        <ul>
          <li>
            <p>Title</p>
          </li>
          <li>
            <input
              type="text"
              value={state.title}
              onChange={(event) => {
                dispatch({
                  key: "title",
                  payload: event.target.value,
                });
              }}
            />
          </li>
        </ul>
      </div>
      <div className="content">
        <Postel
          placement={state.placement}
          trigger={state.showTrigger}
          hideTrigger={state.leaveTrigger}
          triggerDelay={state.triggerDelay}
          hideDelay={state.hideDelay}
          transitionOutMs={state.animated ? 80 : undefined}
          title={state.title}
          content={({ isTransitioningOut, onRequestClose }) => (
            <DemoContent
              animated={state.animated}
              isTransitioningOut={isTransitioningOut}
              content={
                state.content === "custom" ? (
                  <DoggyDemo onRequestClose={onRequestClose} />
                ) : (
                  state.title
                )
              }
            />
          )}
          caret={({ isTransitioningOut }) => (
            <DemoCaret
              animated={state.animated}
              isTransitioningOut={isTransitioningOut}
              caretColor={state.content === "custom" ? "#fff" : "#000"}
            />
          )}
        >
          <button className="button">Trigger</button>
        </Postel>
      </div>
    </div>
  );
}

type DoggyDemoProps = {
  onRequestClose: () => void;
};

const DoggyDemo = (props: DoggyDemoProps) => {
  return (
    <div className="demo-container">
      <div className="demo-header">
        <img
          src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=939&q=80"
          style={{
            height: 50,
            width: 50,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <p className="demo-name">Buddy the dog</p>
      </div>
      <div className="demo-content">
        <p className="demo-info">
          Hi I'm Buddy, the best dog ever. I love eating and am most happy when
          I get to eat real human food! 😋
        </p>
      </div>
      <button className="button button-close" onClick={props.onRequestClose}>
        click to close
      </button>
    </div>
  );
};

type DemoContentProps = {
  animated: boolean;
  content: string | React.ReactNode;
  isTransitioningOut: boolean;
};

const DemoContent = React.forwardRef((props: DemoContentProps, ref: any) => {
  const motionProps = props.animated && {
    initial: { scale: 0.98, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.98, opacity: 0 },
    transition: {
      ease: "easeInOut",
      duration: 0.12,
    },
  };

  return (
    <AnimatePresence>
      {!props.isTransitioningOut && (
        <div ref={ref} style={{ outline: "none" }}>
          <motion.div
            {...motionProps}
            style={
              typeof props.content === "string" && {
                background: "#000",
                padding: "8px",
                color: "#fff",
                fontSize: "13px",
              }
            }
          >
            {props.content}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

type DemoCaretProps = {
  animated: boolean;
  isTransitioningOut: boolean;
  caretColor: string;
};

const DemoCaret = React.forwardRef((props: DemoCaretProps, ref: any) => {
  const motionProps = props.animated && {
    initial: { scale: 1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: {
      ease: "easeInOut",
      duration: 0.1,
    },
  };

  return (
    <AnimatePresence>
      {!props.isTransitioningOut && (
        <div
          ref={ref}
          style={{
            filter: "drop-shadow(rgba(50, 50, 0, 0.5) -1px 16px 6px)",
          }}
        >
          <motion.div
            {...motionProps}
            style={{
              height: 10,
              width: 10,
              background: props.caretColor,
              clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
            }}
          ></motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

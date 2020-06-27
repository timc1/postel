import * as React from "react";
import "./index.css";
import Tooltip from "../../src/index";
import { Placement, ShowTrigger, LeaveTrigger } from "../../index";
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

const showTriggers: ShowTrigger[] = ["hover", "click"];

const leaveTriggers: LeaveTrigger[] = [
  "mouseleave",
  "click",
  "mouseleave-content",
];

const contentTypes = ["none", "custom"];

type State = {
  placement: Placement;
  showTrigger: ShowTrigger;
  leaveTrigger: LeaveTrigger;
  showDelay?: number;
  leaveDelay?: number;
  noCaret: boolean;
  title: string;
  content: "none" | "custom";
};

const initialState: State = {
  placement: "auto",
  showTrigger: "hover",
  leaveTrigger: "mouseleave",
  showDelay: undefined,
  leaveDelay: undefined,
  noCaret: false,
  title: "This is the default tooltip content",
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
          <li>Caret</li>
          <li>
            <label htmlFor="showCaret">
              <input
                id="showCaret"
                type="checkbox"
                checked={state.noCaret}
                onChange={() =>
                  dispatch({
                    key: "noCaret",
                    payload: state.noCaret ? false : true,
                  })
                }
              />
              noCaret
            </label>
          </li>
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
                  onChange={() =>
                    dispatch({
                      key: "content",
                      payload: content,
                    })
                  }
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
              value={state.showDelay}
              onChange={(event) => {
                dispatch({
                  key: "showDelay",
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
              value={state.leaveDelay}
              onChange={(event) => {
                dispatch({
                  key: "leaveDelay",
                  payload: event.target.value,
                });
              }}
            />
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
        <AnimatePresence>
          <Tooltip
            title={state.title}
            placement={state.placement}
            showTrigger={state.showTrigger}
            leaveTrigger={state.leaveTrigger}
            showDelay={state.showDelay}
            leaveDelay={state.leaveDelay}
            noCaret={state.noCaret}
            leaveTransitionMs={500}
            content={
              state.content === "custom"
                ? ({ onRequestClose }) => (
                    <DemoContent onRequestClose={onRequestClose} animate />
                  )
                : null
            }
          >
            <button className="button">Trigger</button>
          </Tooltip>
        </AnimatePresence>
      </div>
    </div>
  );
}

type DemoProps = {
  onRequestClose: () => void;
  animate?: boolean;
  // Comes directly from Tooltip
  isTransitioningOut?: boolean;
};

const DemoContent = React.forwardRef((props: DemoProps, ref) => {
  const motionProps = props.animate
    ? {
        className: "demo-container",
        // framer-motion props
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.98, opacity: 0 },
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 400,
        },
      }
    : {
        ref,
        className: "demo-container",
      };

  return (
    <AnimatePresence>
      {!props.isTransitioningOut && (
        <div
          // @ts-ignore
          ref={props.animate ? ref : undefined}
        >
          {/*
           // @ts-ignore */}
          <motion.div {...motionProps}>
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
                Hi I'm Buddy, the best dog ever. I love eating and am most happy
                when I get to eat real human food! 😋
              </p>
            </div>
            <button
              className="button button-close"
              onClick={props.onRequestClose}
            >
              click to close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

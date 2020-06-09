import * as React from "react";
import "./index.css";
import Tooltip from "../../src/index";
import { Placement, ShowTrigger, LeaveTrigger } from "../../index";

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
  noCaret: boolean;
  title: string;
  content: "none" | "custom";
};

const initialState: State = {
  placement: "auto",
  showTrigger: "hover",
  leaveTrigger: "mouseleave",
  noCaret: false,
  title: "Trigger me",
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
        <div>
          <p>Placement</p>
          {placements.map((placement) => (
            <label key={placement} htmlFor={placement}>
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
          ))}
        </div>
        <div>
          <p>Show trigger</p>
          {showTriggers.map((showTrigger) => (
            <label
              key={`showTrigger-${showTrigger}`}
              htmlFor={`showTrigger-${showTrigger}`}
            >
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
          ))}
        </div>
        <div>
          <p>Leave trigger</p>
          {leaveTriggers.map((leaveTrigger) => (
            <label
              key={`leaveTrigger-${leaveTrigger}`}
              htmlFor={`leaveTrigger-${leaveTrigger}`}
            >
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
          ))}
        </div>
        <div>
          <p>Caret</p>
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
        </div>
        <div>
          <p>Content</p>
          {contentTypes.map((content) => (
            <label key={content} htmlFor={content}>
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
          ))}
        </div>
      </div>
      <div className="content">
        <Tooltip
          title={state.title}
          placement={state.placement}
          showTrigger={state.showTrigger}
          leaveTrigger={state.leaveTrigger}
          noCaret={state.noCaret}
          content={state.content === "custom" ? <DemoContent /> : null}
        >
          <button className="button">Trigger</button>
        </Tooltip>
      </div>
    </div>
  );
}

const DemoContent = React.forwardRef((props, ref) => {
  return (
    <div
      // @ts-ignore
      ref={ref}
      style={{
        opacity: 0,
        height: 200,
        width: 250,
        boxShadow:
          "0 0 0 1px rgba(136, 152, 170, 0.1), 0 15px 35px 0 rgba(49, 49, 93, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.08)",
        borderRadius: 8,
        background: "#fff",
      }}
    />
  );
});

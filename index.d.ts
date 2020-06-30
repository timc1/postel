export type Placement =
  | "auto"
  | "top"
  | "top-end"
  | "top-start"
  | "bottom"
  | "bottom-end"
  | "bottom-start"
  | "left"
  | "right";

export type ShowTrigger = "hover" | "click";

export type LeaveTrigger = "mouseleave" | "click" | "mouseleave-content";

export type Props = {
  children: React.ReactNode;
  content?: React.ReactNode;
  title: string;
  placement?: Placement;
  showTrigger?: ShowTrigger;
  leaveTrigger?: LeaveTrigger;
  noCaret?: boolean;
  showDelay?: number;
  leaveDelay?: number;
  customContentStyles?: Object;
  customCaretStyles?: Object;
  leaveTransitionMs?: number;
};

declare module "@timcchang/react-tooltip" {
  export default function Tooltip(props: Props): any;
}

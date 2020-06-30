export type Props = {
  children: React.ReactNode;
  title: string;
  content: (props: {
    placement: Placement;
    isTransitioningOut: boolean;
    onRequestClose: () => void;
  }) => React.ReactNode;
  caret?: React.ReactNode;
  placement?: Placement;
  showTrigger?: ShowTrigger; // Defaults to hover.
  leaveTrigger?: LeaveTrigger; // Defaults to mouseleave.
  showDelay?: number;
  leaveDelay?: number;
  leaveTransitionMs?: number;
};

export type State = {
  isShowing: boolean;
  isShowingContent: boolean; // State to prevent the flicker between isShowing and when calculating contentPosition.
  isTransitioningOut: boolean;
  contentPosition: ContentPosition;
  caretPosition: CaretPosition;
  placement: Placement;
  activeElement: HTMLElement | null;
};

export type ShowTrigger = "hover" | "click";

export type LeaveTrigger = "mouseleave" | "click" | "mouseleave-content";

export type ContentPosition = {
  x: number;
  y: number;
};

export type CaretPosition = {
  x: number;
  y: number;
  transformOrigin: string;
  rotate: string;
};

export type Position = {
  content: ContentPosition;
  caret: CaretPosition;
};

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

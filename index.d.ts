/**
 * Types
 * =====
 */

export type SharedProps = {
  children: React.ReactNode;
  placement?: Placement;
  preferredAutoPlacement?: Placement;
  triggerDelay?: number;
  trigger?: Trigger;
  hideTrigger?: HideTrigger;
  hideDelay?: number;
  title: string;
  transitionOutMs?: number;
  showTransparentUnderlay?: boolean;
};

// Props: is there a better way to do this?
type Options = {
  isTransitioningOut: boolean;
  onRequestClose: () => void;
};

export type Props =
  | (SharedProps & {
      content?: (options: Options) => React.ReactNode;
      caret?: (options: Options) => React.ReactNode;
    })
  | (SharedProps & {
      content?: React.ReactNode;
      caret?: React.ReactNode;
    })
  | (SharedProps & {
      content?: (options: Options) => React.ReactNode;
      caret?: React.ReactNode;
    })
  | (SharedProps & {
      content?: React.ReactNode;
      caret?: (options: Options) => React.ReactNode;
    });

export type State = {
  isMounting: boolean;
  isIdle: boolean;
  isVisible: boolean;
  isFocused: boolean;
  isLeaving: boolean;
  isDismissed: boolean;
  isTransitioningOut: boolean;
};

export type Action =
  | {
      type: "TRIGGER_SHOW";
    }
  | {
      type: "TRIGGER_HIDE";
    }
  | {
      type: "PORTAL_MOUNTED";
    }
  | {
      type: "TRANSITION_OUT_START";
    }
  | {
      type: "TRANSITION_OUT_COMPLETE";
    };

export type Placement =
  | "auto"
  | "top"
  | "top-start"
  | "top-end"
  | "left"
  | "right"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

export type Trigger = "hover" | "click" | "mousedown";

export type HideTrigger = "mouseleave" | "click";

declare module "postel" {
  export default function Postel(props: Props): any;
}

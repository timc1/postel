# React Tooltip

A tiny, customizable and extensible React tooltip component. ⚡️

[![npm version](https://badge.fury.io/js/%40timcchang%2Freact-tooltip.svg)](https://badge.fury.io/js/%40timcchang%2Freact-tooltip) [![Formatted with Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier) [![TypeScript](https://camo.githubusercontent.com/21132e0838961fbecb75077042aa9b15bc0bf6f9/68747470733a2f2f62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565)](https://www.typescriptlang.org/)


## Background

You want to build a tooltip experience on your site and want to have full control over the look and feel without needing to worry about positioning. You want it to be simple, flexible, and fully extensible to your needs.

A live demo can be found [here](https://react-tooltip.now.sh/).

## Installation

```
yarn install @timcchang/react-tooltip
```

### Basic usage

The simplest way to use `Tooltip` is to wrap it around the component that you want to trigger the tooltip:

```
import Tooltip from "@timcchang/react-tooltip"

export default function App() {
  return(
    <Tooltip title="Password needs to match">
      <button>Register</button>
    </Tooltip>
  )
}
```

### Props

The goal of this component is to ensure a minimal set of props. Here is what you should know:

### children

> `React.ReactNode` | _required_

Wrap `Tooltip` around any DOM element or React component. Because Tooltip uses refs under the hood, make sure that if you are rendering a custom component, ensure that you wrap your component with [`React.forwardRef`](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

### title

> `string` | _required_

`title` will always be present - if no `content` is provided, this will be the UI that will display.

### content

> `React.ReactNode`

Render custom components as the content of your tooltip.

### placement

> "auto"
> | "top"
> | "top-end"
> | "top-start"
> | "bottom"
> | "bottom-end"
> | "bottom-start"
> | "left"
> | "right" / Defaults to "auto"

### showTrigger

> "hover" | "click"

This is what will trigger the tooltip to show.

### leaveTrigger

> "mouseleave" | "click" | "mouseleave-content"

This is what will hide the tooltip.

### noCaret

> boolean / defaults to `false`

This is a flag for showing or hiding the caret.

### showDelay

> number

Trigger the tooltip after n milliseconds.

### hideDelay

> number

Hide the tooltip n milliseconds after `leaveTrigger` fires.

### customContentStyles

> Object

Customize the `Tooltip`'s content styles.

### customCaretStyles

> Object

Customize the `Tooltip`'s caret styles.

## Contributing

Contributions are welcome!

For issues, please feel free to add them [here](https://github.com/timc1/react-tooltip/issues).

Please use `yarn` to manage dependencies. After running `yarn install`, run `yarn start`. Navigate to `http://localhost:8080` and start hacking away!

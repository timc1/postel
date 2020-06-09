<h1 align="center">
  <span>react-tooltip ✌️</span>
  <br>
</h1>
<p align="center" style="font-size: 1.5rem;">
  A tiny, customizable and extensible React tooltip component.
</p>

## Background

You want to build a tooltip experience on your site and want to have full control over the look and feel without needing to worry about positioning. You want it to be simple, flexible, and fully extensible to your needs.

A live demo can be found [here](https://react-tooltip.now.sh/).

## Installation

```
yarn install @timc1/react-tooltip
```

### Basic usage

The simplest way to use `Tooltip` is to wrap it around the component that you want to trigger the tooltip:

```
import Tooltip from "@timc1/react-tooltip"

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

Please use `yarn` to manage dependencies. After running `yarn install`, run `yarn start` to get started.

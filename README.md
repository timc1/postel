# Postel 🌑

[![npm version](https://badge.fury.io/js/postel.svg)](https://badge.fury.io/js/postel) <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"></a> <img src="https://camo.githubusercontent.com/21132e0838961fbecb75077042aa9b15bc0bf6f9/68747470733a2f2f62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565" alt="Built with Typescript badge" />

Postel is a single component that you can easily extend into customized tooltips, dropdowns, flyovers –
any type of UI which would make sense to render outside of your regular React root node, floating
above all other content.

Postel is built on the idea of opening a generic set of props that allow wide customizability. With
that, we attempt to keep the API as simple as possible.

- [Usage](#usage)
- [Props](#props)
- [Contributing](#contributing)
  - [Installation](#installation)

<br />

<p align="center">
  <em>Tooltip</em>
</p>
<p align="center">
  <img width="600" alt="Screen Shot 2020-07-04 at 6 01 50 PM" src="https://user-images.githubusercontent.com/12195101/86521625-3de77a80-be21-11ea-85c4-cad734e3410e.png">
</p>

<p align="center">
  <em>Custom content</em>
</p>
<p align="center">
  <img width="600" alt="Screen Shot 2020-07-04 at 6 01 50 PM" src="https://user-images.githubusercontent.com/12195101/86521626-3f18a780-be21-11ea-91d4-5bb66441b57a.png">
</p>

### Usage

The simplest usage of Postel is building something like a tooltip – just wrap it around the component that you want to trigger:

```
<Postel
  title="Toggle menu"
  content={
    <div className="tooltip">
      Tooltip content
    </div>
  }
  caret={
    <div className="caret" />
  }
}}>
  <button className="button">Trigger</button>
</Postel>
```

## Props

#### children: React.ReactNode

A valid React child that Postel will attach listeners to.

#### title: string

A string to describe the purpose of what will be shown or hidden.

#### placement?: "auto" | "top" | "top-start" | "top-end" | "left" | "right" | "bottom" | "bottom-start" | "bottom-end"

The position that you want Postel to render your `content` relative to the `children`.

#### trigger?: "hover" | "click" | "mousedown"

The type of action you want to apply to the `children` that will show your `content`.

#### triggerDelay?: number

The time in milliseconds that you want to delay showing the `content` after triggering to show.

#### hideTrigger?: "click" | "mouseleave"

The type of action you want to signal that the `content` should hide.

#### hideDelay?: number

The time in milliseconds that you want to delay hiding the `content` after triggering to hide.

#### transitionOutMs?: number

Important for adding leave animations – the amount of time in milliseconds you want your `content` to animate out before unmounting.

#### showTransparentUnderlay?: boolean

Add this if you want a hidden transparent underlay that will cover the entire screen to prevent clicks on UI outside of your `content`.


### Contributing

Contributions are welcome! For requests or bugs, please create an issue [here](https://github.com/timc1/postel/issues).

#### Installation

Postel uses `yarn` to manage dependencies. To install, simply run:

`git clone git@github.com:timc1/postel.git`

`cd postel`

`yarn install`

`yarn start`

Navigate to `localhost:8080` and you should see a hot reloading interface to run the code against.

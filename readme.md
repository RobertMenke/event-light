# Elevator Pitch

In 2018, there's really no need for jQuery, however, jQuery came bundled with a few really nice features. One such feature is their namespaced event binding and unbinding mechanism.

```javascript
const $my_element = $("#root")
$my_element.on("click.listener_one", () => console.log("Number one!")
$my_element.on("click.listener_two", () => console.log("Number two!")

$my_element.click()
//Number one!
//Number two!

$my_element.off("click.listener_one")
$my_element.click()
//Number two!
```

The purpose of this library is to safely add, track, and remove namespaced events without the unnecessary bloat of jQuery. The API is simple, functional, and takes advantage of WeakMap in order to avoid memory leaks.

# Usage

Here's a quick example. I also encourage you to check out the `__tests__` directory for other examples.

```javascript
import { on, off } from "event-light"

const element = document.createElement("div")
on("click.listener_one", element, () => console.log("Number one!"))
on("click.listener_two", element, () => console.log("Number two!"))

element.click()
//Number one!
//Number two!

off("click.listener_one", element)
element.click()
//Number two!
```

# Installation

```
npm install --save event-light
```

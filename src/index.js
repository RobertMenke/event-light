//@flow
'use strict'
import { addEvent, removeEvent } from "./event_manager"

export const on = (event_name : string, element : HTMLElement, listener : (Event) => void) : HTMLElement => {
    if(typeof event_name !== "string") {
        throw new TypeError("Error calling event-light's on method. Event names must be strings like \"click\" or \"click.my_listener\"")
    }

    if(!(element instanceof HTMLElement)) {
        throw new TypeError("Error calling event-light's on method. Elements must instances of HTMLElement.")
    }

    if(typeof listener !== "function") {
        throw new TypeError("Error calling event-light's on method. Listeners must be functions that can be passed to Element.prototype.addEventListener")
    }

    addEvent(event_name, element, listener)
    return element
}

export const off = (event_name : string, element : HTMLElement) : HTMLElement => {
    if(typeof event_name !== "string") {
        throw new TypeError("Error calling event-light's on method. Event names must be strings like \"click\" or \"click.my_listener\"")
    }

    if(!(element instanceof HTMLElement)) {
        throw new TypeError("Error calling event-light's on method. Elements must instances of HTMLElement.")
    }

    removeEvent(event_name, element)
    return element
}

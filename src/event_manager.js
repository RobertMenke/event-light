//@flow
'use strict'

export type ManagedEvent = {
    attachListener : () => void,
    removeListener : () => void
}

type ParsedEvent = {
    event : string,
    identifier : string
}

type EventStorage = Map<string, ManagedEvent>

/**
 *
 * @type {WeakMap<HTMLElement, EventStorage>}
 */
const store = new WeakMap()

/**
 * Add an event to the WeakMap and immediately attach the supplied listener
 *
 * @param type
 * @param element
 * @param listener
 * @return {ManagedEvent}
 */
export const addEvent = (type : string, element : HTMLElement, listener : (Event) => void) : ManagedEvent => {
    const parsed_event = parseEventType(type)
    const event_storage = withMappedElement(element)
    removeExistingEvents(parsed_event, event_storage)
    const managed_event = createEventManager(element, parsed_event.event, listener)
    event_storage.set(parsed_event.identifier, managed_event)
    managed_event.attachListener()

    return managed_event
}

/**
 * Remove the event from the WeakMap and call removeEventListener
 *
 * @param type
 * @param element
 */
export const removeEvent = (type : string, element : HTMLElement) => {
    const parsed_event = parseEventType(type)
    const event_storage = withMappedElement(element)
    removeExistingEvents(parsed_event, event_storage)
}

/**
 * Create closures capable of removing or adding events to a DOM element
 *
 * @param element
 * @param type
 * @param listener
 * @return {{attachListener : function(), removeListener : function()}}
 */
function createEventManager (element : HTMLElement, type : string, listener : Function) : ManagedEvent {
    let is_bound = false
    return {
        attachListener: () => {
            if (!is_bound) {
                element.addEventListener(type, listener, true)
                is_bound = true
            }
        },
        removeListener: () => {
            if (is_bound) {
                element.removeEventListener(type, listener, true)
                is_bound = false
            }
        }
    }
}

/**
 * Get an existing EventStorage map or create a new one and return it
 *
 * @param element
 * @return {EventStorage}
 */
function withMappedElement(element : HTMLElement) : EventStorage {
    const event_store = store.get(element)
    return event_store || mapEvent(element)
}

/**
 * Create the WeakMap entry for an EventStorage map
 *
 * @param element
 * @return {Map<string, ManagedEvent>}
 */
function mapEvent (element : HTMLElement) : EventStorage {
    const new_event = new Map()
    store.set(element, new_event)
    return new_event
}

/**
 * Remove events from the storage map
 *
 * @param parsed_event
 * @param event_storage
 */
function removeExistingEvents(parsed_event : ParsedEvent, event_storage : EventStorage) {
    const listener = event_storage.get(parsed_event.identifier)
    if(listener) {
        listener.removeListener()
        event_storage.delete(parsed_event.identifier)
    }
}



/**
 * Parse a supplied event name like "click.mylistener".
 *
 * If a user simply supplies "click" identify the listener using an underscore
 *
 * @param type
 * @return {{event : string, identifier : string | string}}
 */
function parseEventType(type : string) : ParsedEvent {
    const split = type.split(".")
    return {
        event     : split[ 0 ],
        identifier: split.slice(1).join(".") || "_"
    }
}

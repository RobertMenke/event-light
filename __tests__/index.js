"use strict"
import { on, off } from "../src"

describe("adding and removing events", () => {

    it("should add plain events like \"click\" to an element successfully", () => {
        let state = 0
        const element = document.createElement("div")
        const listener = function() {
            state++
        }
        on("click", element, listener)
        element.click()
        expect(state).toBe(1)
    })

    it("should be able to add and remove anonymous lambda functions", () => {
        let state = 0
        const element = document.createElement("div")
        on("click", element, () => {
            state++
        })
        element.click()
        expect(state).toBe(1)
        off("click", element)
        element.click()
        expect(state).toBe(1)
    })

    it("should be able to manage dot-chained events", () => {
        let state = 0
        const element = document.createElement("div")
        on("click.increment_state", element, () => {
            state++
        })
        on("click.decrement_state", element, () => {
            state--
        })
        element.click()
        expect(state).toBe(0) //the events should both fire and cancel each other out
        off("click.decrement_state", element)
        element.click()
        expect(state).toBe(1) //Now only the increment state should fire
    })

    it("should detach and overwrite the same event when applied twice", () => {
        let state = 0
        const element = document.createElement("div")
        on("click.something", element, () => {
            state++
        })
        on("click.something", element, () => {
            state = state + 5
        })
        element.click()
        expect(state).toBe(5)
    })

    it("should not throw when removing a non-existent event", () => {
        let state = 0
        const element = document.createElement("div")
        off("click.something", element)
        element.click()
        expect(state).toBe(0)
    })
})

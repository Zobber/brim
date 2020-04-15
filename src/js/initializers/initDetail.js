/* @flow */

import {ipcRenderer} from "electron"

import closeWindow from "../flows/closeWindow"
import initBoom from "./initBoom"
import initQueryParams, {getQueryParams} from "./initQueryParams"
import initStore from "./initStore"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import refreshWindow from "../flows/refreshWindow"
import {appendDivId} from "./initDOM"

let {id} = getQueryParams()

export default () => {
  return invoke(ipc.windows.initialState(id)).then((initialState) => {
    let boom = initBoom(undefined)
    let store = initStore(initialState, boom)
    global.getState = store.getState

    let dispatch = store.dispatch

    appendDivId("tooltip-root")
    appendDivId("context-menu-root")

    // initMenuActionListeners(dispatch)
    initQueryParams(store)

    ipcRenderer.on("close", () => dispatch(closeWindow()))
    global.onbeforeunload = () => dispatch(refreshWindow())

    return store
  })
}

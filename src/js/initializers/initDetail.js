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
import {viewLogDetail} from "../flows/viewLogDetail"
import LogDetails from "../state/LogDetails"

let {id} = getQueryParams()

export default () => {
  return invoke(ipc.windows.initialState(id)).then((initialState) => {
    // remove handlers, since they are complex objects
    delete initialState.handlers

    let boom = initBoom(undefined)
    let store = initStore(initialState, boom)
    global.getState = store.getState

    let dispatch = store.dispatch

    appendDivId("notification-root")
    appendDivId("modal-root")
    appendDivId("tooltip-root")
    appendDivId("context-menu-root")
    appendDivId("measure-layer")

    initQueryParams(store)

    const log = LogDetails.build(store.getState())
    dispatch(LogDetails.clear())
    dispatch(viewLogDetail(log))

    ipcRenderer.on("close", () => dispatch(closeWindow()))
    global.onbeforeunload = () => dispatch(refreshWindow())

    return store
  })
}

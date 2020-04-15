/* @flow */
import type {WindowName} from "../tron/windowManager"
import type {WindowParams} from "../tron/window"

export type IpcMsg =
  | WindowsOpenMsg
  | WindowsCloseMsg
  | WindowsInitialStateMsg
  | WindowsDestroyMsg
  | GlobalStoreInitMsg
  | GlobalStoreDispatchMsg

export type WindowsOpenMsg = {
  channel: "windows:open",
  name: WindowName,
  params: WindowParams,
  data: Object
}

export type WindowsCloseMsg = {
  channel: "windows:close"
}

export type WindowsInitialStateMsg = {
  channel: "windows:initialState",
  id: string
}

export type WindowsDestroyMsg = {
  channel: "windows:destroy"
}

export type GlobalStoreInitMsg = {
  channel: "globalStore:init"
}

export type GlobalStoreDispatchMsg = {
  channel: "globalStore:dispatch"
}

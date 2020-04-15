/* @flow */
import type {WindowName} from "../../tron/windowManager"
import type {WindowParams} from "../../tron/window"
import type {
  WindowsCloseMsg,
  WindowsDestroyMsg,
  WindowsInitialStateMsg,
  WindowsOpenMsg
} from "../types"

export default {
  open(
    name: WindowName,
    params: $Shape<WindowParams>,
    state: Object
  ): WindowsOpenMsg {
    return {
      channel: "windows:open",
      name,
      params,
      state
    }
  },
  close(): WindowsCloseMsg {
    return {
      channel: "windows:close"
    }
  },
  destroy(): WindowsDestroyMsg {
    return {
      channel: "windows:destroy"
    }
  },
  initialState(id: string): WindowsInitialStateMsg {
    return {
      channel: "windows:initialState",
      id
    }
  }
}

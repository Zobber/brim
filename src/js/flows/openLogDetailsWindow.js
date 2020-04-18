/* @flow */

import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import type {Thunk} from "redux-thunk"

export const openLogDetailsWindow = (): Thunk => (dispatch, getState) => {
  invoke(ipc.windows.open("detail", {size: [1000, 800]}, getState()))
}

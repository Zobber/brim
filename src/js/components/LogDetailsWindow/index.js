/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {Md5Panel} from "../LogDetails/Md5Panel"
import ConnPanel from "../LogDetails/ConnPanel"
import FieldsPanel from "../LogDetails/FieldsPanel"
import LogDetails from "../../state/LogDetails"
import UidPanel from "../LogDetails/UidPanel"
import {Center, Left, PaneHeader, PaneTitle, Right} from "../Pane"
import {reactElementProps} from "../../test/integration"
import Tab from "../../state/Tab"
import {downloadPcap} from "../../flows/downloadPcap"
import HistoryButtons from "../common/HistoryButtons"

export default function LogDetailsWindow() {
  let dispatch = useDispatch()
  const prevExists = useSelector(LogDetails.getHistory).prevExists()
  const nextExists = useSelector(LogDetails.getHistory).nextExists()
  const log = useSelector(LogDetails.build)
  const space = useSelector(Tab.space)
  const packetsAvailable =
    log && log.isPath("conn") && space && space.packet_support

  function onPacketsClick() {
    dispatch(downloadPcap(log))
  }

  return (
    <div className="log-detail-window">
      <PaneHeader>
        <Left>
          <HistoryButtons
            prevExists={prevExists}
            nextExists={nextExists}
            backFunc={() => dispatch(LogDetails.back())}
            forwardFunc={() => dispatch(LogDetails.forward())}
          />
        </Left>
        <Center>
          <PaneTitle>Log Details</PaneTitle>
        </Center>
        <Right>
          {packetsAvailable && (
            <button
              className="panel-button text"
              onClick={onPacketsClick}
              {...reactElementProps("pcapsButton")}
            >
              PCAPS
            </button>
          )}
        </Right>
      </PaneHeader>
      <div className="log-detail-body">
        <FieldsPanel log={log} />
        {log.correlationId() && <UidPanel log={log} />}
        <ConnPanel log={log} />
        {log.getString("md5") && <Md5Panel log={log} />}
      </div>
    </div>
  )
}

/* @flow */

const electronPath = require("electron")

import {Application} from "spectron"
import * as path from "path"

import {
  getSearchText,
  logIn,
  searchDisplay,
  setSpan,
  startSearch,
  waitForLoginAvailable,
  waitForHistogram,
  waitForSearch,
  writeSearch
} from "../lib/app.js"
import {retry} from "../lib/control"
import {TestTimeout, handleError} from "../lib/jest.js"
import {dataSets, selectors} from "../../src/js/test/integration"

describe("Test search mods via right-clicks", () => {
  let app
  beforeEach(() => {
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..", "..")]
    })
    return app.start().then(() => app.webContents.send("resetState"))
  })

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  test(
    "Include / Exclude this value works",
    (done) => {
      let includeExcludeFlow = async () => {
        await waitForLoginAvailable(app)
        await logIn(app)
        await waitForHistogram(app)
        await waitForSearch(app)
        await app.client.rightClick(
          selectors.viewer.resultCellContaining(
            dataSets.corelight.rightClickSearch.includeValue
          )
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem("Include this value")
        )
        await app.client.rightClick(
          selectors.viewer.resultCellContaining("conn")
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem("Exclude this value")
        )
        return searchDisplay(app)
      }
      includeExcludeFlow()
        .then((searchResults) => {
          expect(searchResults).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "Use as start/end time works",
    (done) => {
      let startEndFlow = async () => {
        await waitForLoginAvailable(app)
        await logIn(app)
        await waitForHistogram(app)
        await waitForSearch(app)
        await writeSearch(app, "_path=conn")
        await startSearch(app)
        await waitForSearch(app)
        await app.client.rightClick(
          selectors.viewer.resultCellContaining(
            dataSets.corelight.rightClickSearch.startTime
          )
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem('Use as "start" time')
        )
        await app.client.rightClick(
          selectors.viewer.resultCellContaining(
            dataSets.corelight.rightClickSearch.endTime
          )
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem('Use as "end" time')
        )
        return searchDisplay(app)
      }
      startEndFlow()
        .then((searchResults) => {
          expect(searchResults).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "New Search works",
    (done) => {
      let newSearchFlow = async () => {
        await waitForLoginAvailable(app)
        await logIn(app)
        await waitForHistogram(app)
        await waitForSearch(app)
        await app.client.rightClick(
          selectors.viewer.resultCellContaining(
            dataSets.corelight.rightClickSearch.newSearchSetup
          )
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem("Include this value")
        )
        await app.client.rightClick(
          selectors.viewer.resultCellContaining("weird")
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem("New search with this value")
        )
        return searchDisplay(app)
      }
      newSearchFlow()
        .then((searchResults) => {
          expect(searchResults).toMatchSnapshot()
        })
        // This section verifies the previous search was cleared in favor of
        // the new search "weird".
        .then(() => getSearchText(app))
        .then((searchText) => {
          expect(searchText).toBe("weird")
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )

  test(
    "Pivot to logs works",
    (done) => {
      let pivotToLogsFlow = async () => {
        await waitForLoginAvailable(app)
        await logIn(app)
        await waitForHistogram(app)
        await waitForSearch(app)
        await app.client.rightClick(
          selectors.viewer.resultCellContaining("dns")
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem("Count by _path")
        )
        await app.client.rightClick(
          selectors.viewer.resultCellContaining("dhcp")
        )
        await app.client.click(
          selectors.viewer.rightClickMenuItem("Pivot to logs")
        )
        return searchDisplay(app)
      }
      pivotToLogsFlow().then((searchResults) => {
        expect(searchResults).toMatchSnapshot()
        done()
      })
    },
    TestTimeout
  )

  test(
    "conn for www.mybusinessdoc.com is found via correlation",
    (done) => {
      waitForLoginAvailable(app)
        .then(() => logIn(app))
        .then(() => waitForHistogram(app))
        .then(() => waitForSearch(app))
        .then(() => setSpan(app, dataSets.corelight.logDetails.span))
        .then(() =>
          writeSearch(app, dataSets.corelight.logDetails.initialSearch)
        )
        .then(() => startSearch(app))
        .then(() => waitForSearch(app))
        .then(() => searchDisplay(app))
        .then((results) => {
          expect(results).toMatchSnapshot()
        })
        .then(() =>
          app.client.rightClick(
            selectors.viewer.resultCellContaining(
              dataSets.corelight.logDetails.getDetailsFrom
            )
          )
        )
        .then(() =>
          app.client.click(selectors.viewer.rightClickMenuItem("Open details"))
        )
        .then(() =>
          Promise.all([
            retry(() => app.client.getText(selectors.correlationPanel.tsLabel)),
            retry(() => app.client.getText(selectors.correlationPanel.pathTag)),
            retry(() =>
              app.client.getText(selectors.correlationPanel.duration)
            ).then((result) => [result])
          ])
        )
        .then((correlationData) => {
          expect(correlationData).toMatchSnapshot()
          done()
        })
        .catch((err) => {
          handleError(app, err, done)
        })
    },
    TestTimeout
  )
})
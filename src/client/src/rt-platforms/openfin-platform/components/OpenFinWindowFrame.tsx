import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { isParentAppOpenfinLauncher } from 'rt-platforms'
import styled from 'styled-components/macro'
import { OpenFinChrome, OpenFinHeader, OpenFinFooter } from './OpenFinChrome'
import { getAppName } from 'rt-util'

const OpenFinFrameRoot = styled.div`
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0;
  position: absolute;
  overflow: hidden;

  --title-bar-height: 3.5rem;
  --openfin-footer-height: 2.5rem;

  #layout-container {
    height: 100%;
    width: 100%;
    padding: 0;
  }

  .lm_tabs {
    background-color: ${({ theme }) => theme.core.lightBackground};
    border-radius: 0px;
  }

  .lm_content {
    background-color: ${({ theme }) => theme.core.lightBackground};
  }

  .lm_tab,
  .lm_tab.lm_active {
    background-color: ${({ theme }) => theme.core.darkBackground} !important;
    color: ${({ theme }) => theme.core.textColor} !important;
  }

  .lm_controls {
    display: none;
  }

  .lm_splitter {
    background-color: ${({ theme }) => theme.core.offBackground} !important;
  }
`

const LayoutRoot = styled.div`
  height: calc(100% - var(--title-bar-height) - var(--openfin-footer-height));
`

export const OpenFinWindowFrame: React.FC = () => {
  const [, setFromLauncher] = useState<boolean>(false)

  const win = fin.Window.getCurrentSync()
  const headerControlHandlers = {
    close: () => win.close(),
    minimize: () => win.minimize(),
    maximize: () =>
      win.getState().then(state => (state === 'maximized' ? win.restore() : win.maximize())),
  }

  useEffect(() => {
    isParentAppOpenfinLauncher()
      .then(isLauncher => {
        setFromLauncher(isLauncher)
      })
      .catch(() => {
        console.error('Cannot find parent window')
      })
  }, [])

  useEffect(() => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      })
    )
    fin.Platform.Layout.init()
  }, [])

  return (
    <OpenFinFrameRoot>
      <Helmet>
        <style type="text/css">{`
        :root, body {
          font-size: 16px;
        }
        body, select, button, li, span, div {
          font-family: inherit;
          color: inherit;
        }
    `}</style>
      </Helmet>
      <OpenFinChrome>
        <OpenFinHeader {...headerControlHandlers} title={getAppName()} />

        <LayoutRoot>
          {/* This div and id is required by Openfin */}
          <div id="layout-container"></div>
        </LayoutRoot>
        <OpenFinFooter />
      </OpenFinChrome>
    </OpenFinFrameRoot>
  )
}
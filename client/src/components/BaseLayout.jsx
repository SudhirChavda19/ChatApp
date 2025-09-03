import React from 'react'
import WelcomePage from './WelcomePage'
import { Outlet } from 'react-router-dom'

function BaseLayout({children}) {
  return (
    <WelcomePage>
        {children}
    </WelcomePage>
  )
}

export default BaseLayout;
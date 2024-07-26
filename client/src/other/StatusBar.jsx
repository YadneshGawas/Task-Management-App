/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import clsx from 'clsx'
import React from 'react'

const StatusBar = ({ className }) => {
  return (
    <div className={clsx("w-full py-2 rounded-t-xl", className)}>
    </div>
  )
}

export default StatusBar;

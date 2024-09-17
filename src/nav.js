import React, { useState, useEffect } from 'react'
import { Link, Route, Switch } from 'wouter-preact'

export function Nav() {
  return (
    <div>
      <Link path="/homepage" style={{ marginRight: '1em' }}>
        Homepage
      </Link>
    </div>
  )
}

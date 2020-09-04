import * as React from 'react'
import { StackActions } from '@react-navigation/native'

export const navigationRef: React.createRef<unknown> = React.createRef()

export function navigate(name: string, params = {}) {
  navigationRef.current?.navigate(name, params)
}

export function push(name: string, params = {}) {
  navigationRef.current?.dispatch(StackActions.push(name, params))
}
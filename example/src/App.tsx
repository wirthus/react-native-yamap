import * as React from 'react'

import { StyleSheet } from 'react-native'
import YaMap from './../../'
// @ts-ignore
import { API_KEY } from './config'

YaMap.init(API_KEY);

export default function App() {
  return (
    <YaMap style={styles.container} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

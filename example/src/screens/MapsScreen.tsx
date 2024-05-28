import React from "react";
import {StyleSheet} from "react-native";
import YaMap from "../../../";

export const MapsScreen = () => {

  return (
    <YaMap
      initialRegion={{lat: 55.751244, lon: 37.618423, zoom: 12, }}
      style={styles.container}
      logoPosition={{horizontal: 'right', vertical: 'top'}}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

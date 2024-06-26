import React, {useState} from "react";
import {Platform, StyleSheet} from "react-native";
import YaMap, {Marker} from "../../../";

export const MapScreen = () => {
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <YaMap
      initialRegion={{lat: 55.751244, lon: 37.618423, zoom: 12}}
      style={styles.container}
      logoPosition={{horizontal: 'right', vertical: 'top'}}
      onMapLoaded={() => {
        setMapLoaded(true)
      }}
    >
      <Marker
          point={{lat: 55.751244, lon: 37.618423}}
          source={require('../assets/images/marker.png')}
          scale={0.3}
          visible={Platform.OS === 'android' ? mapLoaded : true}
      />
    </YaMap>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

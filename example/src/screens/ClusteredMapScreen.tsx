import React, {useState} from "react";
import {Platform, StyleSheet} from "react-native";
import {ClusteredYamap, Marker} from "../../../";

export const ClusteredMapScreen = () => {
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <ClusteredYamap
      clusterColor="red"
      initialRegion={{lat: 56.754215, lon: 38.421242, zoom: 6}}
      onMapLoaded={() => {
        setMapLoaded(true)
      }}
      clusteredMarkers={[
        {
          point: {
            lat: 56.754215,
            lon: 38.622504,
          },
          data: {},
        },
        {
          point: {
            lat: 56.754215,
            lon: 38.222504,
          },
          data: {},
        },
      ]}
      renderMarker={(info) => (
        <Marker
          key={`${info.point.lat}_${info.point.lon}`}
          point={info.point}
          scale={0.3}
          source={require('../assets/images/marker.png')}
          visible={Platform.OS === 'android' ? mapLoaded : true}
        />
      )}
      style={styles.container}
    />
)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

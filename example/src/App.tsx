import React, {useState} from 'react'
import YaMap, {Geocoder} from './../../'
import {SelectOption} from "./components/SelectOption";

import {API_KEY, GEOCODER_API_KEY} from './config'
import {MapScreen} from "./screens/MapScreen";
import {AddressToGeoScreen} from "./screens/AddressToGeoScreen";
import {Screen} from "./screens/screens";
import {ClusteredMapScreen} from "./screens/ClusteredMapScreen";

YaMap.init(API_KEY);
Geocoder.init(GEOCODER_API_KEY)

export default function App() {
  const [selectedScreen, setSelectedScreen] = useState(Screen.Map)

  return (
    <>
      <SelectOption selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen} />
      {selectedScreen === Screen.Map && <MapScreen />}
      {selectedScreen === Screen.AddressToGeo && <AddressToGeoScreen />}
      {selectedScreen === Screen.ClusteredMap && <ClusteredMapScreen />}
    </>
  )
}


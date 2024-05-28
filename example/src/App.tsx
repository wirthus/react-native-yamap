import React, {useState} from 'react'
import YaMap, {Geocoder} from './../../'
import {SelectOption} from "./components/SelectOption";

import {API_KEY, GEOCODER_API_KEY} from './config'
import {MapsScreen} from "./screens/MapsScreen";
import {AddressToGeoScreen} from "./screens/AddressToGeoScreen";
import {Screen} from "./screens/screens";

YaMap.init(API_KEY);
Geocoder.init(GEOCODER_API_KEY)

export default function App() {
  const [selectedScreen, setSelectedScreen] = useState(Screen.Maps)

  return (
    <>
      <SelectOption selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen} />
      {selectedScreen === Screen.Maps && <MapsScreen />}
      {selectedScreen === Screen.AddressToGeo && <AddressToGeoScreen />}
    </>
  )
}


import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import {Geocoder, Point} from '../../../'
import {useDebounceFunc} from '../helper/debounce'

export const AddressToGeoScreen = () => {
  const [address, setAddress] = useState('Moscow')
  const [geo, setGeo] = useState<Point|undefined>()

  const addressToGeo = useDebounceFunc(async (text: string) => {
    try {
      if (text.trim()) {
        setGeo(await Geocoder.addressToGeo(text))
      }
    } catch (e) {
      console.error('addressToGeo', e)
    }
  })

  useEffect( () => {
    setGeo(undefined)
    addressToGeo(address)
  }, [address]);

  return (
    <View style={styles.container}>
      <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder={'Address'}
          style={styles.textInput}
      />
      <Text style={styles.geoText}>{JSON.stringify(geo)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginVertical: 16,
  },
  geoText: {
    color: '#000',
    alignSelf: 'center',
  },
})

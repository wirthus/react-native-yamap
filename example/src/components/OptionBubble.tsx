import React, {FC} from 'react'
import {
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
} from 'react-native'


interface Props {
  option: string;
  selected: boolean;
  selectOption: () => void;
}

export const OptionBubble: FC<Props> = ({option, selected, selectOption}) => {

  return (
    <View style={styles.touchable}>
      <TouchableNativeFeedback
        onPress={selectOption}>
        <View style={[styles.item, selected && styles.itemSelected]}>
          <Text style={[styles.title, selected && styles.titleSelected]}>
            {option}
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles =
  StyleSheet.create({
    touchable: {
      borderRadius: 10,
      overflow: 'hidden',
    },
    item: {
      backgroundColor: '#eee',
      borderRadius: 10,
      paddingVertical: 6,
      paddingHorizontal: 16,
      marginVertical: 8,
    },
    itemSelected: {
      backgroundColor: '#ff9800',
    },
    title: {
      color: '#1b1918',
      fontSize: 14,
      lineHeight: 18.5,
    },
    titleSelected: {
      color: '#fff',
    },
  });

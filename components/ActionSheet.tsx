import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

const ActionSheet = () => {
  const [alignment] = useState(new Animated.Value(0));

  const toggleActionSheet = (value: number) => {
    Animated.timing(alignment, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const actionSheetIntropolate = alignment.interpolate({
    inputRange: [0, 1],
    outputRange: [-height / 2.4 + 50, 0],
  });
  const actionSheetStyle = {
    bottom: actionSheetIntropolate,
  };

  const gestureHandler = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (e.nativeEvent.contentOffset.y > 0) toggleActionSheet(1);
    else if (e.nativeEvent.contentOffset.y < 0) toggleActionSheet(0);
  };

  return (
    <Animated.View style={[styles.container, actionSheetStyle]}>
      <ScrollView
        style={styles.grabber}
        scrollEventThrottle={16}
        onScroll={(e) => gestureHandler(e)}
      ></ScrollView>
      <Text>Hello World</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height / 2.4,
    width: width / 1.05,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginHorizontal: 10,
  },
  grabber: {
    width: 60,
    borderTopWidth: 5,
    borderTopColor: "#aaa",
    alignSelf: "center",
    marginTop: 10,
  },
});

export default ActionSheet;

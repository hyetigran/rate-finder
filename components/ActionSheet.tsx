import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SearchControls from "./SearchControls";

const { width, height } = Dimensions.get("screen");

const ActionSheet = () => {
  const [alignment] = useState(new Animated.Value(0));

  const toggleActionSheet = (value: number) => {
    Animated.timing(alignment, {
      toValue: value,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const actionSheetIntropolate = alignment.interpolate({
    inputRange: [0, 1],
    outputRange: [-height / 2.4 + 20, 0],
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
      <SearchControls />
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
    height: height / 2,
    width: width,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  grabber: {
    width: 70,
    borderTopWidth: 6,
    borderTopColor: "#aaa",
    alignSelf: "center",
    //paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
});

export default ActionSheet;

import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

import { RateState } from "../store/types/rateTypes";

const { width, height } = Dimensions.get("screen");

interface ActionProps {
  itemData: RateState;
  curr: string;
  isBank: number;
}
const RateListRow = ({ itemData, curr, isBank }: ActionProps) => {
  const { item } = itemData;

  return (
    <View style={styles.rowContainer}>
      <View style={styles.rowNameContainer}>
        <Text numberOfLines={1} style={styles.rowName}>
          {item.name}
        </Text>
        {!!isBank && item.distance && (
          <Text style={styles.distance}>{`(${item.distance.toFixed(
            2
          )}km)`}</Text>
        )}
      </View>
      <Text style={styles.rowCurr}>{item[curr].buy}</Text>
      <Text style={styles.rowCurr}>{item[curr].sell}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    borderColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  rowNameContainer: {
    flex: 3,
  },
  rowName: {
    width: "66%",
    fontWeight: "bold",
  },
  distance: {},
  rowCurr: {
    flex: 1,
    textAlign: "center",
    alignSelf: "center",
  },
});

export default RateListRow;

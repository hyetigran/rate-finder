import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

import { RateState } from "../store/types/rateTypes";

const { width, height } = Dimensions.get("screen");

interface ActionProps {
  itemData: RateState;
  curr: string;
}
const RateListRow = ({ itemData, curr }: ActionProps) => {
  const { item } = itemData;

  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowName}>{item.name}</Text>
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
  rowName: {
    flex: 3,
    fontWeight: "bold",
  },
  rowCurr: {
    flex: 1,
    textAlign: "center",
  },
});

export default RateListRow;

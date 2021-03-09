import React, { useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { ButtonGroup } from "react-native-elements";

import RateListRow from "../components/RateListRow";
import { Text, View } from "../components/Themed";
import { RateState, RootState } from "../store/types/rateTypes";
import { computeDistanceBetween } from "@goparrot/react-native-geometry-utils";

export default function ExchangeRateList(props: any) {
  const topTabName = props.route.name;
  const [currency, setCurrency] = useState("USD");
  const [paymentType, setPaymentType] = useState(0);

  const [bankCash, bankCard, exchangeCash] = useSelector((state: RootState) => {
    let bankCash = state.rate.cash;
    let bankCard = state.rate.card.filter(
      (bank: RateState) => bank.isBank === 1
    );
    let exchangeCash = state.rate.card.filter(
      (exchange: RateState) => exchange.isBank === 0
    );
    return [bankCash, bankCard, exchangeCash];
  });
  let rateData: RateState[] = [];
  if (topTabName === "Exchange") {
    rateData = exchangeCash;
    console.log("RD-ex");
  } else {
    if (paymentType === 1) {
      console.log("RD-bCash");
      rateData = bankCash;
    } else {
      console.log("RD-bCard");

      rateData = bankCard;
    }
  }

  const paymentTypeHandler = (index: number) => {
    setPaymentType(index);
    // Show card/cash rates
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.optionContainer}>
        <View style={styles.typeContainer}>
          <ButtonGroup
            buttons={["Card", "Cash"]}
            // disabled={}
            selectedIndex={paymentType}
            onPress={paymentTypeHandler}
          ></ButtonGroup>
        </View>
        <DropDownPicker
          items={[
            { label: "USD", value: "USD" },
            { label: "EUR", value: "EUR" },

            { label: "RUR", value: "RUR" },
            { label: "GBP", value: "GBP" },
          ]}
          defaultValue={currency}
          containerStyle={{ height: 40, width: "25%" }}
          style={{ backgroundColor: "#fafafa" }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          dropDownStyle={{ backgroundColor: "#fafafa", zIndex: 10 }}
          onChangeItem={(item) => setCurrency(item.value)}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.rowName}>Name</Text>
        <Text style={styles.rowCurr}>Buy</Text>
        <Text style={styles.rowCurr}>Sell</Text>
      </View>
      {rateData && (
        <FlatList
          data={rateData}
          keyExtractor={(item) => {
            return !item.name ? item.name : Math.random().toString();
          }}
          renderItem={(itemData: RateState) => (
            <RateListRow itemData={itemData} curr={currency} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  optionContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    zIndex: 10,
    marginVertical: 10,
  },
  typeContainer: {
    flex: 1,
    maxWidth: "50%",
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    borderColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  rowName: {
    flex: 3,
    fontWeight: "bold",
    fontSize: 18,
  },
  rowCurr: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
});

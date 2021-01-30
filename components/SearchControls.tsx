import React, { useState } from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import { CheckBox } from "react-native-elements";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";

const { width, height } = Layout.window;
const { background, primary, text, disabled } = Colors.light;
interface SearchForm {
  isCard: boolean;
  isBuy: boolean;
  currency: string;
}
const initialState = {
  isCard: true,
  isBuy: true,
  currency: "USD",
};
const SearchControls = () => {
  const [searchForm, setSearchForm] = useState<SearchForm>(initialState);

  const toggleSwitch = () => {
    setSearchForm((prevState: SearchForm) => {
      let isCard = !prevState.isCard;
      return { ...prevState, isCard };
    });
  };
  const selectCurrencyHandler = (currency: string) => {
    setSearchForm((prevState: SearchForm) => {
      return { ...prevState, currency };
    });
  };
  return (
    <View style={styles.container}>
      <Text>Transaction Type:</Text>
      <View style={styles.switchContainer}>
        <Text>{searchForm.isCard ? "Card" : "Cash"}</Text>
        <Switch
          trackColor={{ false: disabled, true: primary }}
          thumbColor={background}
          ios_backgroundColor={disabled}
          onValueChange={toggleSwitch}
          value={searchForm.isCard}
        ></Switch>
      </View>
      <View>
        {["USD", "EUR", "RUB", "GBP"].map((currency) => {
          return (
            <CheckBox
              center
              title={currency}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={searchForm.currency === currency}
              onPress={() => selectCurrencyHandler(currency)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginVertical: 40,
    marginHorizontal: 10,
    justifyContent: "center",
    alignSelf: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grabber: {
    width: 60,
    borderTopWidth: 5,
    borderTopColor: "#aaa",
    alignSelf: "center",
    marginTop: 10,
  },
});

export default SearchControls;

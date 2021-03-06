import React, { useState } from "react";
import { StyleSheet, View, Text, Switch, Dimensions } from "react-native";
import { CheckBox, ButtonGroup, Button } from "react-native-elements";

import Colors from "../constants/Colors";

const { width, height } = Dimensions.get("screen");

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

interface ActionProps {
  submitSearch: (data: any) => void;
  toggleActionSheet: (data: any) => void;
}

const SearchControls = ({ submitSearch, toggleActionSheet }: ActionProps) => {
  const [searchForm, setSearchForm] = useState<SearchForm>(initialState);

  const toggleSwitch = () => {
    setSearchForm((prevState: SearchForm) => {
      let isCard = !prevState.isCard;
      return { ...prevState, isCard, isBuy: true };
    });
  };
  const selectCurrencyHandler = (currency: string) => {
    setSearchForm((prevState: SearchForm) => {
      return { ...prevState, currency };
    });
  };

  const actionTypeHandler = (index: number) => {
    setSearchForm((prevState: SearchForm) => {
      return { ...prevState, isBuy: !!!index };
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Transaction Type</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.text}>{searchForm.isCard ? "Card" : "Cash"}</Text>
        <Switch
          trackColor={{ false: disabled, true: primary }}
          thumbColor={background}
          ios_backgroundColor={disabled}
          onValueChange={toggleSwitch}
          value={searchForm.isCard}
        ></Switch>
      </View>
      <ButtonGroup
        buttons={["Buy", "Sell"]}
        disabled={searchForm.isCard ? [1] : false}
        selectedIndex={searchForm.isBuy ? 0 : 1}
        onPress={actionTypeHandler}
      ></ButtonGroup>
      <View style={styles.checkboxContainer}>
        {["USD", "EUR", "RUB", "GBP"].map((currency) => {
          return (
            <CheckBox
              center
              key={currency}
              title={currency}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={searchForm.currency === currency}
              onPress={() => selectCurrencyHandler(currency)}
              containerStyle={styles.checkbox}
            />
          );
        })}
      </View>
      <Button
        onPress={() => {
          submitSearch(searchForm);
          // Minimize action sheet
          toggleActionSheet(0);
        }}
        title="Search"
        raised
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    //marginTop: 10,
    marginHorizontal: 5,
    justifyContent: "space-around",
    alignSelf: "center",
    height: "90%",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  text: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: width * 0.7,
    justifyContent: "center",
  },
  checkbox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    margin: 1,
    padding: 2,
  },
});

export default SearchControls;

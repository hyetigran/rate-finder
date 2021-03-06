import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import { ButtonGroup } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import RateListRow from "../components/RateListRow";
import { Text, View } from "../components/Themed";
import { RateState, RootState } from "../store/types/rateTypes";
import { addDistancePropertyToExchanges } from "../constants/CalcDistance";
import Colors from "../constants/Colors";

import { sortRateList } from "../store/actions/rateActions";

interface Location {
  latitude: number;
  longitude: number;
}
const primaryBlue = Colors.light.primary;

export default function ExchangeRateList(props: any) {
  const topTabName = props.route.name;
  const initialPaymentType = topTabName === "Exchanges" ? 1 : 0;
  const [userLocation, setUserLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [currency, setCurrency] = useState("USD");
  const [paymentType, setPaymentType] = useState(initialPaymentType);
  const [sortColumn, setSortColumn] = useState(-1); // initial (not set) -1, 0 distance, 1 buy, 2 sell
  const [sortType, setSortType] = useState(true); // true max to min, false min to max

  const rateData: RateState[] = useSelector((state: RootState) => {
    if (topTabName === "Exchanges") {
      let exchangeData = state.rate.exchangeCash;
      // Check default location has been over-ridden
      if (userLocation.latitude && userLocation.longitude) {
        let enhExchangeCash: RateState[] = addDistancePropertyToExchanges(
          exchangeData,
          userLocation
        );
        return enhExchangeCash;
      } else {
        return exchangeData;
      }
    } else {
      if (paymentType === 1) {
        return state.rate.bankCash;
      } else {
        return state.rate.bankCard;
      }
    }
  });
  const dispatch = useDispatch();

  useEffect(() => {
    saveUserLocation();
  }, []);

  const paymentTypeHandler = (index: number) => {
    setPaymentType(index);
    // Show card/cash rates
  };

  const getUserLocation = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userLocation");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      // Handle user location not previously stored/saved
      console.log(error);
    }
  };

  const saveUserLocation = async () => {
    const userLocation: Location = await getUserLocation();
    setUserLocation(userLocation);
  };

  const sortColumnHandler = (col: number) => {
    let keyName =
      topTabName !== "Exchanges"
        ? paymentType === 1
          ? "bankCash"
          : "bankCard"
        : "exchangeCash";

    if (sortColumn !== col) {
      setSortColumn(col);
    }
    setSortType(!sortType);
    dispatch(sortRateList(rateData, col, sortType, keyName, currency));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.optionContainer}>
        <View style={styles.typeContainer}>
          <ButtonGroup
            buttons={["Card", "Cash"]}
            disabled={topTabName === "Exchanges" ? [0] : false}
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
        {/* <TouchableOpacity
          style={styles.rowName}
          //onPress={() => sortColumnHandler(0)}
        > */}
        <Text style={styles.rowName}>Name</Text>
        {/* {sortColumn === 0 && (
            <Ionicons
              size={20}
              name={`caret-${sortType ? "up" : "down"}-outline`}
            />
          )} */}
        {/* </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.rowCurr}
          onPress={() => sortColumnHandler(1)}
        >
          <Text>Buy</Text>
          {sortColumn === 1 && (
            <Ionicons
              size={22}
              color={primaryBlue}
              name={`caret-${sortType ? "up" : "down"}-outline`}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowCurr}
          onPress={() => sortColumnHandler(2)}
        >
          <Text>Sell</Text>
          {sortColumn === 2 && (
            <Ionicons
              size={22}
              color={primaryBlue}
              name={`caret-${sortType ? "up" : "down"}-outline`}
            />
          )}
        </TouchableOpacity>
      </View>
      {rateData && (
        <FlatList
          data={rateData}
          keyExtractor={(item) => {
            return !item.name ? item.name : Math.random().toString();
          }}
          renderItem={(itemData: RateState) => (
            <RateListRow
              itemData={itemData}
              curr={currency}
              isBank={initialPaymentType}
            />
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
    height: 40,
  },
  rowName: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  rowCurr: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  Dimensions,
  Alert,
} from "react-native";
import { CheckBox, ButtonGroup, Button } from "react-native-elements";

import { GOOGLE_API_KEY } from "@env";
import Colors from "../constants/Colors";
import { RateState, RootState } from "../store/types/rateTypes";

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
  setMarkers: (data: any) => void;
  toggleActionSheet: (value: number) => void;
  lat: number;
  lng: number;
}

const SearchControls = ({
  setMarkers,
  toggleActionSheet,
  lat,
  lng,
}: ActionProps) => {
  const [searchForm, setSearchForm] = useState<SearchForm>(initialState);
  const rateData = useSelector((state: RootState) => {
    return state.rate.banks;
  });

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

  const submitSearch = () => {
    const { isCard, isBuy, currency } = searchForm;
    let cur = currency.toLowerCase();
    // Find best rate
    let buying = isBuy ? "buy" : "sell";
    const bestRate =
      rateData &&
      rateData
        .map((bank: RateState) => {
          let specificRate: number = bank[cur][buying];
          return { name: bank.bankName, rate: specificRate };
        })
        .reduce(
          (
            prev: { name: string; rate: number },
            current: { name: string; rate: number }
          ) => {
            if (isBuy) {
              return prev.rate > current.rate ? prev : current;
            } else {
              return prev.rate < current.rate ? prev : current;
            }
          },
          { name: "", rate: 0 }
        );
    if (!bestRate) {
      // Handle error if rate list fails to fetch/sort
      return;
    }
    // Call google places API for location
    fetchMarkers(bestRate);
  };

  const fetchMarkers = async (bestRate: { name: string; rate: number }) => {
    let type = searchForm.isCard ? "atm" : "bank";
    let keyword = bestRate.name;

    try {
      let response: any = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&keyword=${keyword}&key=${GOOGLE_API_KEY}`
      );

      let results = response.data.results.map((place: any) => {
        let id = place.place_id;
        let name = place.name;
        let address = place.vicinity;
        let latitude = place.geometry.location.lat;
        let longitude = place.geometry.location.lng;
        let isOpen = place.opening_hours?.open_now || false;

        let marker = { id, name, address, latitude, longitude, isOpen };
        return marker;
      });

      setMarkers(results);

      toggleActionSheet(0);
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "We were unable to fetch search results. Please try again later.",
        [{ text: "Okay" }]
      );
    }
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
      <Button onPress={submitSearch} title="Search" raised />
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

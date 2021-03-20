import React, { useState, useEffect } from "react";
import axios from "axios";
import { StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// @ts-ignore
import { GOOGLE_API_KEY } from "@env";

import { Text, View } from "../components/Themed";
// @ts-ignore
import { defaultBankImage } from "../assets/images";
import Colors from "../constants/Colors";

interface ActionProps {
  route: { params: { placeId: string } };
}
interface BusinessDetail {
  address: string;
  phoneNumber: string;
  rating: number;
  reviewCount: number;
  imageURI: string;
  isOpen: boolean;
  hours: string[];
}
const primaryBlue = Colors.light.primary;

export default function BusinessDetailScreen(props: ActionProps) {
  const [businessDetail, setBusinessDetail] = useState<BusinessDetail>();
  const placeId = props.route.params.placeId;

  useEffect(() => {
    fetchBusinessDetails(placeId);
  }, []);
  const fetchBusinessDetails = async (placeId: string) => {
    // AXIOS CALL to GOOGLE PLACE & PHOTO API
    try {
      const response: any = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
      const {
        formatted_address,
        international_phone_number,
        opening_hours,
        photos,
        reviews,
        rating,
      } = response.data.result;
      let photoResponse: any = "";
      if (photos && photos.length) {
        let photoRef = photos[0].photo_reference;
        photoResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
        );
      }
      setBusinessDetail({
        address: formatted_address,
        phoneNumber: international_phone_number,
        rating: rating,
        reviewCount: reviews.length ? reviews.length : 0,
        isOpen: opening_hours.open_now,
        hours: opening_hours.weekday_text,
        imageURI: photoResponse?.request?.responseURL
          ? photoResponse.request.responseURL
          : "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={defaultBankImage} />
      <View>
        <Text>5.0 star, star, star (2 reviews)</Text>
      </View>
      <View style={styles.rowDetail}>
        <Ionicons color={primaryBlue} size={30} name="location-outline" />
        <Text>address</Text>
      </View>
      <View style={styles.rowDetail}>
        <Ionicons color={primaryBlue} size={30} name="call-outline" />
        <Text>phone</Text>
      </View>
      <View style={styles.rowDetail}>
        <Ionicons color={primaryBlue} size={30} name="time-outline" />
        <Text>is open</Text>
        <TouchableOpacity>
          <Ionicons color={primaryBlue} size={24} name="chevron-down-outline" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  rowDetail: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    borderColor: "rgba(0,0,0,0.2)",
    borderBottomWidth: 1,
  },
});

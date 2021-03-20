import React, { useState, useEffect } from "react";
import axios from "axios";
import { StyleSheet, ScrollView } from "react-native";
// @ts-ignore
import { GOOGLE_API_KEY } from "@env";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

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
        reviewCount: reviews.length,
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
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/BusinessDetailScreen.tsx" />
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
});

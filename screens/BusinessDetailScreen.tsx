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

export default function BusinessDetailScreen(props: ActionProps) {
  const [businessDetail, setBusinessDetail] = useState();
  const placeId = props.route.params.placeId;

  useEffect(() => {
    fetchBusinessDetails(placeId);
  });
  const fetchBusinessDetails = async (placeId: string) => {
    // AXIOS CALL to GOOGLE API
    try {
      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
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

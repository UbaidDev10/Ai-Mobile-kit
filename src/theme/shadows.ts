import { Platform } from "react-native";

export const shadows = {
  card:
    Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: {
            width: 0,
            height: 2,
          },
        }
      : {
          elevation: 3,
        },
};
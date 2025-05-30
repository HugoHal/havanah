import { Pressable, StyleSheet } from "react-native";
import Svg, { Circle, TextPath, Text as SvgText, Defs, Path } from "react-native-svg";

export default function StartTrip({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Svg height="80" width="80" viewBox="0 0 80 80">
        <Defs>
          {/* Chemin circulaire pour le texte */}
          <Path
            id="topCircle"
            d="M 15, 40 A 25 25 0 0 1 65 40"
          />
          <Path
            id="bottomCircle"
            d="M 10, 40 A 30 30 0 0 0 70 40"
          />
        </Defs>
        
        {/* Cercle de fond */}
        <Circle cx="40" cy="40" r="35" fill="#FF9900" />
        
        {/* Texte courbe en haut */}
        <SvgText fontSize="10" fontWeight="bold" fill="#000" letterSpacing="1.5">
          <TextPath href="#topCircle" startOffset="25%" textAnchor="middle">
            PARTIR
          </TextPath>
        </SvgText>
        
        {/* Texte courbe en bas */}
        <SvgText fontSize="10" fontWeight="bold" fill="#000" letterSpacing="1.5">
          <TextPath href="#bottomCircle" startOffset="25%" textAnchor="middle">
            EN TRIP
          </TextPath>
        </SvgText>
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});
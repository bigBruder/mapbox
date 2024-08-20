import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const BackIcon: React.FC<SvgProps> = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.6562 19.9141C15.4688 20.1016 15.2695 20.1016 15.0586 19.9141L7.71094 12.5312C7.5 12.3438 7.5 12.1562 7.71094 11.9688L15.0586 4.58594C15.2695 4.39844 15.4688 4.39844 15.6562 4.58594L16.3594 5.28906C16.5703 5.47656 16.5703 5.67578 16.3594 5.88672L9.99609 12.25L16.3594 18.6133C16.5703 18.8242 16.5703 19.0234 16.3594 19.2109L15.6562 19.9141Z"
      fill="#8386A5"
    />
  </Svg>
);
export default BackIcon;

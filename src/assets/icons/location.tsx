import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const LocationIcon: React.FC<SvgProps> = (props) => (
  <Svg width={21} height={21} viewBox="0 0 21 21" fill="none" {...props}>
    <Path
      d="M19.0078 0.5C20.2969 0.5 21.3906 1.86719 20.8438 3.15625L13.3438 19.4062C12.9922 20.1875 12.2891 20.5 11.625 20.5C10.6875 20.5 9.71094 19.8359 9.71094 18.6641V11.7891H2.83594C0.843755 11.7891 0.218755 9.01562 2.09376 8.15625L18.3438 0.65625C18.5781 0.578125 18.8125 0.5 19.0078 0.5ZM11.5859 18.6641L19.0859 2.45312L19.0469 2.41406L2.87501 9.83594C2.83594 9.875 2.87501 9.91406 2.87501 9.91406H9.71094H11.5859V18.6641Z"
      fill="#8386A5"
    />
  </Svg>
);
export default LocationIcon;

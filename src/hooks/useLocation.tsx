import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [location, setLocation] = useState<number[] | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        // accuracy: Location.Accuracy.High,
      });
      setLocation([location?.coords['longitude'], location?.coords['latitude']]);
    };

    fetchLocation();

    return () => {
      // Clean up if needed
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return location;
};

export default useLocation;

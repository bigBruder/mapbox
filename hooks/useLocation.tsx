import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    };

    fetchLocation();

    return () => {
      // Clean up if needed
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return location;
};

export default useLocation;

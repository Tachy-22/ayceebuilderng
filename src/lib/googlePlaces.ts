// Google Places API utility functions

export interface PlaceCoordinates {
  lat: number;
  lng: number;
  address: string;
  placeId: string;
}

// Calculate distance between two coordinates using Haversine formula
export const calculateHaversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Validate address quality and accuracy
const validateAddressQuality = (result: any, originalAddress: string): boolean => {
  // Check if the result has a reasonable accuracy level
  const locationType = result.geometry?.location_type;
  const acceptableLocationTypes = ['ROOFTOP', 'RANGE_INTERPOLATED', 'GEOMETRIC_CENTER'];
  
  // Reject if location type is too imprecise
  if (!acceptableLocationTypes.includes(locationType)) {
    console.log('Address rejected: poor location accuracy -', locationType);
    return false;
  }
  
  // Check if the formatted address contains meaningful components
  const formattedAddress = result.formatted_address.toLowerCase();
  const addressComponents = result.address_components || [];
  
  // Must have at least a locality and administrative area
  const hasLocality = addressComponents.some((comp: any) => 
    comp.types.includes('locality') || comp.types.includes('sublocality')
  );
  
  const hasAdministrativeArea = addressComponents.some((comp: any) => 
    comp.types.includes('administrative_area_level_1') || 
    comp.types.includes('administrative_area_level_2')
  );
  
  if (!hasLocality && !hasAdministrativeArea) {
    console.log('Address rejected: insufficient location components');
    return false;
  }
  
  // Check for obviously fake/test addresses
  const originalLower = originalAddress.toLowerCase();
  const suspiciousPatterns = [
    /^test\s*$/,
    /^other\s*$/,
    /^fake/,
    /^invalid/,
    /^dummy/,
    /dont.*do/,
    /^no\.\s*\d+\s*[a-z]+\s*[a-z]+\s*lane\s*$/i, // Pattern like "No. 1 akinyode Nat Lane"
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(originalLower))) {
    console.log('Address rejected: matches suspicious pattern -', originalAddress);
    return false;
  }
  
  // Ensure the result is actually in Nigeria
  const isInNigeria = formattedAddress.includes('nigeria') || 
                     addressComponents.some((comp: any) => 
                       comp.long_name.toLowerCase() === 'nigeria'
                     );
  
  if (!isInNigeria) {
    console.log('Address rejected: not in Nigeria');
    return false;
  }
  
  return true;
};

// Geocode an address using Google Places API
export const geocodeAddress = async (address: string): Promise<PlaceCoordinates | null> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('Google Places API key not found');
    return null;
  }

  // Basic validation before even calling the API
  if (!address || address.trim().length < 3) {
    console.log('Address rejected: too short');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:NG&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      
      // Validate the quality and accuracy of the geocoded result
      if (!validateAddressQuality(result, address)) {
        return null;
      }
      
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address,
        placeId: result.place_id,
      };
    } else if (data.status === 'ZERO_RESULTS') {
      console.log('Address rejected: no results found for -', address);
    } else {
      console.log('Geocoding failed with status:', data.status);
    }

    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Get distance matrix between multiple origins and destinations
export const getDistanceMatrix = async (
  origins: string[],
  destinations: string[]
): Promise<{
  distances: number[];
  durations: number[];
  status: string;
} | null> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('Google Places API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origins.join('|')
      )}&destinations=${encodeURIComponent(
        destinations.join('|')
      )}&units=metric&region=ng&language=en&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to get distance matrix');
    }

    const data = await response.json();
    
    if (data.status === 'OK') {
      const distances: number[] = [];
      const durations: number[] = [];
      
      data.rows.forEach((row: any) => {
        row.elements.forEach((element: any) => {
          if (element.status === 'OK') {
            distances.push(element.distance.value / 1000); // Convert to km
            durations.push(element.duration.value / 60); // Convert to minutes
          } else {
            distances.push(0);
            durations.push(0);
          }
        });
      });

      return {
        distances,
        durations,
        status: data.status,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting distance matrix:', error);
    return null;
  }
};

// Get place details by place ID
export const getPlaceDetails = async (placeId: string): Promise<PlaceCoordinates | null> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('Google Places API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to get place details');
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      const result = data.result;
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address,
        placeId: placeId,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
};

// Validate if an address is within Nigeria
export const isAddressInNigeria = (address: string): boolean => {
  const nigerianKeywords = [
    'nigeria', 'lagos', 'abuja', 'kano', 'ibadan', 'port harcourt', 
    'benin city', 'maiduguri', 'zaria', 'aba', 'jos', 'ilorin',
    'oyo', 'enugu', 'abeokuta', 'ogbomoso', 'sokoto', 'onitsha',
    'warri', 'okene', 'calabar', 'uyo', 'katsina', 'kaduna'
  ];
  
  const lowerAddress = address.toLowerCase();
  return nigerianKeywords.some(keyword => lowerAddress.includes(keyword));
};

// Format address for display
export const formatAddressForDisplay = (address: string): string => {
  // Remove country name if it's Nigeria
  const cleanAddress = address.replace(/, Nigeria$/, '');
  
  // Truncate if too long
  if (cleanAddress.length > 60) {
    return cleanAddress.substring(0, 57) + '...';
  }
  
  return cleanAddress;
};

// Get Nigerian states for validation/filtering
export const getNigerianStates = (): string[] => {
  return [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
    'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
    'Federal Capital Territory'
  ];
};

// Default depot/warehouse locations in major Nigerian cities
export const getDefaultDepotLocations = (): { [key: string]: PlaceCoordinates } => {
  return {
    lagos: {
      lat: 6.5244,
      lng: 3.3792,
      address: "Ikeja City Mall, Alausa, Obafemi Awolowo Wy, Oregun, Ikeja, Lagos, Nigeria",
      placeId: "ChIJOwg_06VLXhARYlp2YSQp0Ag"
    },
    abuja: {
      lat: 9.0765,
      lng: 7.3986,
      address: "Central Business District, Abuja, Nigeria",
      placeId: "ChIJrQZbPFH_ThARYXoO3MjJ7_0"
    },
    portharcourt: {
      lat: 4.8156,
      lng: 7.0498,
      address: "Port Harcourt, Rivers State, Nigeria",
      placeId: "ChIJ4VJT1BgTSBARKMKqklYFVEc"
    },
    kano: {
      lat: 12.0022,
      lng: 8.5920,
      address: "Kano, Kano State, Nigeria",
      placeId: "ChIJ2c0kSvxn7RERAACLnmZ_mN4"
    }
  };
};
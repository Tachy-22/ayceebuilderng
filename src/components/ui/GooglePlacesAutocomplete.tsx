"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Google Places API Types
declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }

  namespace google {
    namespace maps {
      namespace places {
        class AutocompleteService {
          getPlacePredictions(
            request: AutocompletionRequest,
            callback: (predictions: PlacePrediction[] | null, status: PlacesServiceStatus) => void
          ): void;
        }


        class AutocompleteSessionToken { }

        interface AutocompletionRequest {
          input: string;
          sessionToken: AutocompleteSessionToken;
          componentRestrictions?: { country: string };
          types?: string[];
          language?: string;
        }


        enum PlacesServiceStatus {
          OK = 'OK',
          ZERO_RESULTS = 'ZERO_RESULTS',
          OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
          REQUEST_DENIED = 'REQUEST_DENIED',
          INVALID_REQUEST = 'INVALID_REQUEST',
          UNKNOWN_ERROR = 'UNKNOWN_ERROR'
        }
      }
    }
  }
}

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}


interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: {
    address: string;
    formatted_address?: string;
    name?: string;
    lat: number;
    lng: number;
    placeId: string;
  }) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  onAgreeToEstimatedBilling?: (currentAddress?: string) => void;
  showEstimatedBillingOption?: boolean;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Start typing your address",
  label = "Address",
  className = "",
  disabled = false,
  onAgreeToEstimatedBilling,
  showEstimatedBillingOption = false,
}) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [sessionToken, setSessionToken] = useState<any>(null);

  const autocompleteService = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize Google Places API
  const initializeGooglePlaces = useCallback(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();

      // We'll use the Geocoding API instead of PlacesService for place details
      // This avoids the need for a map instance

      // Create a new session token
      setSessionToken(new window.google.maps.places.AutocompleteSessionToken());
      setIsGoogleLoaded(true);

      console.log('Google Places initialized with AutocompleteService');
    }
  }, []);

  // Load Google Places API script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    console.log('Google Places API Key available:', !!apiKey);
    console.log('API Key prefix:', apiKey?.substring(0, 10) + '...');

    if (!apiKey) {
      console.error('Google Places API key not found in environment variables');
      return;
    }

    // Check if Google is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeGooglePlaces();
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Script is loading, wait for it
      window.initGooglePlaces = initializeGooglePlaces;
      return;
    }

    // Load the Google Places API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
    script.async = true;
    script.defer = true;

    window.initGooglePlaces = initializeGooglePlaces;

    script.onerror = () => {
      console.error('Failed to load Google Places API');
    };

    document.head.appendChild(script);

    return () => {
      // Clean up if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if ('initGooglePlaces' in window) {
        delete (window as any).initGooglePlaces;
      }
    };
  }, [initializeGooglePlaces]);

  // Debounced search function with fallback searches
  const searchPlaces = useCallback(
    debounce((query: string) => {
      if (!autocompleteService.current || !sessionToken || query.length < 3) {
        setPredictions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);

      // First try with establishments and geocode
      const primaryRequest = {
        input: query,
        sessionToken: sessionToken,
        componentRestrictions: { country: 'ng' },
        types: ['establishment', 'geocode'],
        language: 'en',
      };

      console.log('Google Places primary request:', primaryRequest);

      autocompleteService.current.getPlacePredictions(
        primaryRequest,
        (predictions: any, status: any) => {
          console.log('Primary response:', { predictions, status, count: predictions?.length });

          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions && predictions.length > 0) {
            setIsLoading(false);
            setPredictions(predictions);
            setShowSuggestions(true);
          } else {
            // Fallback search without type restrictions
            console.log('Trying fallback search without type restrictions');

            const fallbackRequest = {
              input: query,
              sessionToken: sessionToken,
              componentRestrictions: { country: 'ng' },
              language: 'en',
            };

            autocompleteService.current.getPlacePredictions(
              fallbackRequest,
              (fallbackPredictions: any, fallbackStatus: any) => {
                setIsLoading(false);

                console.log('Fallback response:', {
                  fallbackPredictions,
                  fallbackStatus,
                  count: fallbackPredictions?.length
                });

                if (fallbackStatus === window.google.maps.places.PlacesServiceStatus.OK && fallbackPredictions) {
                  setPredictions(fallbackPredictions);
                  setShowSuggestions(true);
                } else {
                  console.log('Both searches failed. Status:', fallbackStatus);
                  setPredictions([]);
                  setShowSuggestions(true); // Keep suggestions open to show "No results" message
                }
              }
            );
          }
        }
      );
    }, 300),
    [sessionToken]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (isGoogleLoaded) {
      searchPlaces(newValue);
    }
  };

  // Handle place selection using Geocoding API
  const handlePlaceSelect = async (prediction: PlacePrediction) => {
    setIsLoading(true);
    setShowSuggestions(false);
    onChange(prediction.description);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

      // Use Geocoding API to get place details
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${prediction.place_id}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to get place details');
      }

      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const place = data.results[0];

        if (onPlaceSelect && place.geometry && place.geometry.location) {
          onPlaceSelect({
            address: place.formatted_address,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            placeId: place.place_id,
          });
        }
      } else {
        console.error('Geocoding API error:', data.status);
        // Don't call onPlaceSelect with invalid coordinates
        // Let the distance calculation handle geocoding fallback
        console.log('Geocoding failed, not calling onPlaceSelect with invalid coordinates');
      }

      // Create new session token for future requests
      setSessionToken(new window.google.maps.places.AutocompleteSessionToken());

    } catch (error) {
      console.error('Error getting place details:', error);

      // Don't call onPlaceSelect with invalid coordinates
      // Let the distance calculation handle geocoding fallback
      console.log('Error getting coordinates, not calling onPlaceSelect with invalid coordinates');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clear input
  const handleClear = () => {
    onChange('');
    setPredictions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {label && <Label className="text-black/80 mb-2">{label}</Label>}

      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            disabled={disabled || !isGoogleLoaded}
            className="pr-8"
            autoComplete="off"
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Clear button */}
          {value && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* API not loaded message */}
        {!isGoogleLoaded && (
          <div className="text-xs text-muted-foreground mt-1">
            Loading address suggestions...
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && predictions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
          >
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="px-3 py-3 text-sm hover:bg-gray-100 cursor-pointer flex items-start border-b border-gray-100 last:border-b-0"
                onClick={() => handlePlaceSelect(prediction)}
              >
                <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-gray-500 text-xs truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {showSuggestions && predictions.length === 0 && !isLoading && value.length >= 3 && (
          <div className="absolute z-50 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-3 text-sm text-gray-500">
            <div className="font-medium mb-1">No addresses found</div>
            <div className="text-xs">
              Try searching for:
              <br />• Major landmarks (e.g., &quot;Shoprite Ikeja&quot;)
              <br />• Street names (e.g., &quot;Allen Avenue Lagos&quot;)
              <br />• Area names (e.g., &quot;Victoria Island Lagos&quot;)
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-amber-600">
              <div className="flex items-center mb-2">
                <span className="mr-1">⚠️</span>
                <span>Note: If your address is not found, delivery cost estimates may vary slightly from actual charges.</span>
              </div>
              {showEstimatedBillingOption && onAgreeToEstimatedBilling && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onAgreeToEstimatedBilling(value);
                    setShowSuggestions(false);
                  }}
                  className="w-full mt-2 text-xs h-7 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                >
                  Agree to Estimated Billing
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default GooglePlacesAutocomplete;
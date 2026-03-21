import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GeoLocation } from '../types/weather';

interface Props {
  onSearch: (query: string) => void;
  suggestions: GeoLocation[];
  onSelectCity: (city: GeoLocation) => void;
  onGeolocation: () => void;
  onClearSuggestions: () => void;
}

const SearchBar: React.FC<Props> = ({
  onSearch,
  suggestions,
  onSelectCity,
  onGeolocation,
  onClearSuggestions,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (text: string) => {
    setQuery(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(text);
    }, 400);
  };

  const handleSelect = (city: GeoLocation) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setQuery(city.name);
    onSelectCity(city);
    onClearSuggestions();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder={t('search.placeholder')}
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={query}
            onChangeText={handleChange}
          />
        </View>
        <TouchableOpacity style={styles.geoButton} onPress={onGeolocation}>
          <Text style={styles.geoIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item: GeoLocation, index: number) => (
            <TouchableOpacity
              key={`${item.latitude}-${item.longitude}-${index}`}
              style={styles.suggestionItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.suggestionName}>{item.name}</Text>
              <Text style={styles.suggestionDetail}>
                {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
    zIndex: 100,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.7),
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: wp(4.3),
    paddingHorizontal: wp(3.7),
    height: hp(6.2),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    fontSize: wp(4.8),
    marginRight: wp(2.1),
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: wp(4.3),
    outlineStyle: 'none',
  } as any,
  geoButton: {
    width: wp(13.3),
    height: hp(6.2),
    borderRadius: wp(4.3),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  geoIcon: {
    fontSize: wp(5.9),
  },
  suggestionsContainer: {
    position: 'absolute',
    top: hp(6.2) + hp(0.75),
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30,30,60,0.95)',
    borderRadius: wp(3.7),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflowY: 'auto',
    zIndex: 200,
  } as any,
  suggestionItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4.3),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  suggestionName: {
    color: '#FFFFFF',
    fontSize: wp(4.3),
    fontWeight: '600',
  },
  suggestionDetail: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: wp(3.5),
    marginTop: hp(0.25),
  },
});

export default SearchBar;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
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
          <FlatList
            data={suggestions}
            keyExtractor={(item: GeoLocation, index: number) => `${item.latitude}-${item.longitude}-${index}`}
            renderItem={({ item }: { item: GeoLocation }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionName}>{item.name}</Text>
                <Text style={styles.suggestionDetail}>
                  {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    outlineStyle: 'none',
  } as any,
  geoButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  geoIcon: {
    fontSize: 22,
  },
  suggestionsContainer: {
    marginTop: 6,
    backgroundColor: 'rgba(30,30,60,0.95)',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    maxHeight: 220,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  suggestionName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionDetail: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 2,
  },
});

export default SearchBar;

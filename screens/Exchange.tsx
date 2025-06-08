import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

interface ExchangeRate {
  currency: string;
  rate: number;
}

interface ApiResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

const Exchange = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        'http://api.exchangeratesapi.io/v1/latest?access_key=3e4d7454298a39389a234fc3746ca508&symbols=HKD,USD,AUD,CAD,PLN,MXN,CNY,TWD,JPY,SGD,KRW&format=1'
      );
      const data: ApiResponse = await response.json();

      if (data.success) {
        // Add EUR rate (base currency) manually as it's not in the response
        const allRates = {
          EUR: 1,
          ...data.rates
        };

        const ratesArray = Object.entries(allRates).map(([currency, rate]) => ({
          currency,
          rate,
        }));

        setRates(ratesArray);
        setLastUpdated(new Date(data.timestamp * 1000).toLocaleString());
      } else {
        throw new Error('Failed to fetch exchange rates');
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchExchangeRates();
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const renderItem = ({ item }: { item: ExchangeRate }) => (
    <View style={styles.rateItem}>
      <View style={styles.currencyContainer}>
        <Text style={styles.currencyCode}>{item.currency}</Text>
        <Text style={styles.currencyName}>
          {getCurrencyName(item.currency)}
        </Text>
      </View>
      <Text style={styles.rate}>{item.rate.toFixed(4)}</Text>
    </View>
  );

  const getCurrencyName = (code: string): string => {
    const currencyNames: { [key: string]: string } = {
      EUR: 'Euro',
      HKD: 'Hong Kong Dollar',
      USD: 'US Dollar',
      AUD: 'Australian Dollar',
      CAD: 'Canadian Dollar',
      PLN: 'Polish Złoty',
      MXN: 'Mexican Peso',
      CNY: 'Chinese Yuan',
      TWD: 'Taiwan Dollar',
      JPY: 'Japanese Yen',
      SGD: 'Singapore Dollar',
      KRW: 'South Korean Won',
    };
    return currencyNames[code] || code;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exchange Rates</Text>
        <Text style={styles.subtitle}>Base Currency: EUR</Text>
        <Text style={styles.updateTime}>Last updated: {lastUpdated}</Text>
      </View>
      <FlatList
        data={rates}
        renderItem={renderItem}
        keyExtractor={(item) => item.currency}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  updateTime: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  currencyContainer: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  currencyName: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  rate: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2196F3',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default Exchange; 
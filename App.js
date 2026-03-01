import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NavigationContainer, DefaultTheme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const ProductContext = React.createContext(null);
const SCREEN_WIDTH = Dimensions.get('window').width;
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH - 32;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || '';

const categories = ['Plants', 'Seeds', 'Soil', 'Tools', 'Outdoor Decor'];

const carouselImages = [
  {
    id: 'c1',
    title: 'Spring Collection',
    subtitle: 'Fresh arrivals and easy starter kits',
    image:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'c2',
    title: 'Balcony Garden',
    subtitle: 'Compact plants for small spaces',
    image:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'c3',
    title: 'Home Herbs',
    subtitle: 'Grow basil, mint, and more at home',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
  },
];

const demoProducts = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    price: 24,
    tag: 'Indoor',
    imageUrl:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Lavender Pot',
    price: 12,
    tag: 'Fragrant',
    imageUrl:
      'https://images.unsplash.com/photo-1592997571659-0b21ff64313b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'Herb Starter Set',
    price: 18,
    tag: 'Kitchen Garden',
    imageUrl:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    name: 'Organic Potting Mix',
    price: 9.5,
    tag: 'Soil',
    imageUrl:
      'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=80',
  },
];

const navTheme = {
  ...NavTheme,
  colors: {
    ...NavTheme.colors,
    background: '#f7f7f5',
  },
};

function normalizeProduct(item, index) {
  return {
    id: String(item.id ?? `${Date.now()}-${index}`),
    name: item.name || item.title || `Plant ${index + 1}`,
    price: Number(item.price ?? 0),
    tag: item.tag || item.category || 'Garden',
    imageUrl:
      item.imageUrl ||
      item.image ||
      item.thumbnail ||
      demoProducts[index % demoProducts.length].imageUrl,
  };
}

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} EUR`;
}

function ShadButton({ title, onPress, variant = 'primary', style }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.buttonBase,
        variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
        style,
      ]}
    >
      <Text style={variant === 'primary' ? styles.buttonPrimaryText : styles.buttonSecondaryText}>
        {title}
      </Text>
    </Pressable>
  );
}

function ShadInput({ value, onChangeText, placeholder, keyboardType = 'default' }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      placeholderTextColor="#909091"
      style={styles.input}
      autoCapitalize="none"
    />
  );
}

function HomeScreen({ navigation }) {
  const { apiNote } = React.useContext(ProductContext);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const onCarouselScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CAROUSEL_ITEM_WIDTH);
    setActiveSlide(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerWrap}>
          <Text style={styles.headerLabel}>Garden Center</Text>
          <Text style={styles.headerTitle}>Grow Beautiful Spaces</Text>
          <Text style={styles.headerBody}>
            Order garden accessories and items from the Garden Center
          </Text>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          snapToInterval={CAROUSEL_ITEM_WIDTH}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={onCarouselScroll}
          scrollEventThrottle={16}
          style={styles.carouselRow}
        >
          {carouselImages.map((slide) => (
            <View key={slide.id} style={styles.carouselItem}>
              <Image source={{ uri: slide.image }} style={styles.carouselImage} />
              <View style={styles.carouselOverlay} />
              <View style={styles.carouselTextWrap}>
                <Text style={styles.carouselTitle}>{slide.title}</Text>
                <Text style={styles.carouselSubtitle}>{slide.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotRow}>
          {carouselImages.map((slide, idx) => (
            <View
              key={slide.id}
              style={[styles.dot, idx === activeSlide ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
          <ShadButton title="View Products" onPress={() => navigation.navigate('Products')} />
          <ShadButton
            title="Add Product"
            onPress={() => navigation.navigate('Add Product')}
            variant="secondary"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Categories</Text>
          <View style={styles.categoriesWrap}>
            {categories.map((category) => (
              <View key={category} style={styles.tag}>
                <Text style={styles.tagText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Store Hours</Text>
          <Text style={styles.cardText}>Mon-Sat: 08:00-19:00</Text>
          <Text style={styles.cardText}>Sun: 09:00-17:00</Text>
          <Text style={styles.cardMuted}>123 Bloomfield Ave, Springfield</Text>
          <Text style={styles.cardMuted}>{apiNote}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProductsScreen({ navigation }) {
  const { products, loading, loadProducts } = React.useContext(ProductContext);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.productsHeader}>
          <Text style={styles.pageTitle}>Products</Text>
          <ShadButton title="Refresh" onPress={loadProducts} variant="secondary" style={styles.smallButton} />
        </View>

        {loading ? <ActivityIndicator size="small" color="#2f6f55" style={styles.loader} /> : null}

        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <View style={styles.productBody}>
              <Text style={styles.productTag}>{item.tag}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
              <ShadButton title="Add to Cart" onPress={() => { }} variant="secondary" style={styles.smallButton} />
            </View>
          </View>
        ))}

        <ShadButton title="Create New Product" onPress={() => navigation.navigate('Add Product')} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AddProductScreen({ navigation }) {
  const { addProduct } = React.useContext(ProductContext);
  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [tag, setTag] = React.useState('Garden');
  const [imageUrl, setImageUrl] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const onSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Product name is required.');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert('Validation', 'Enter a valid price.');
      return;
    }

    setSaving(true);
    const result = await addProduct({
      name: name.trim(),
      price: numericPrice,
      tag: tag.trim(),
      imageUrl: imageUrl.trim(),
    });
    setSaving(false);

    if (!result.ok) {
      Alert.alert('Error', result.error || 'Could not save product.');
      return;
    }

    navigation.navigate('Products');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined, default: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add Product</Text>
            <ShadInput value={name} onChangeText={setName} placeholder="Product Name" />
            <ShadInput value={price} onChangeText={setPrice} placeholder="Price (EUR)" keyboardType="decimal-pad" />
            <ShadInput value={tag} onChangeText={setTag} placeholder="Tag (Indoor, Soil...)" />
            <ShadInput value={imageUrl} onChangeText={setImageUrl} placeholder="Image URL" />
            <ShadButton title={saving ? 'Saving...' : 'Save Product'} onPress={onSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  const [products, setProducts] = React.useState(demoProducts);
  const [loading, setLoading] = React.useState(false);
  const [apiNote, setApiNote] = React.useState(
    API_BASE_URL ? `API connected: ${API_BASE_URL}` : 'No API URL set. Showing local demo data.'
  );

  const loadProducts = React.useCallback(async () => {
    if (!API_BASE_URL) {
      setProducts(demoProducts);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }
      const body = await response.json();
      const rawList = Array.isArray(body) ? body : body.products || [];
      const normalized = rawList.map((item, index) => normalizeProduct(item, index));
      setProducts(normalized.length ? normalized : demoProducts);
      setApiNote(`Loaded ${normalized.length} product(s) from API.`);
    } catch (error) {
      setProducts(demoProducts);
      setApiNote(`API load failed. Showing demo data. (${error.message})`);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = React.useCallback(async (payload) => {
    if (!API_BASE_URL) {
      const localProduct = normalizeProduct({ ...payload, id: `local-${Date.now()}` }, 0);
      setProducts((current) => [localProduct, ...current]);
      setApiNote('Saved locally. Set EXPO_PUBLIC_API_URL to POST to API.');
      return { ok: true };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }
      const body = await response.json();
      const created = normalizeProduct(body, 0);
      setProducts((current) => [created, ...current]);
      setApiNote('Product created via API.');
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({ products, loading, apiNote, loadProducts, addProduct }),
    [products, loading, apiNote, loadProducts, addProduct]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#f7f7f5' },
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Garden Center' }} />
          <Stack.Screen name="Products" component={ProductsScreen} />
          <Stack.Screen name="Add Product" component={AddProductScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f5',
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  headerWrap: {
    marginBottom: 12,
  },
  headerLabel: {
    fontSize: 13,
    color: '#2f6f55',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  headerTitle: {
    marginTop: 6,
    fontSize: 30,
    color: '#101826',
    fontWeight: '800',
  },
  headerBody: {
    marginTop: 8,
    fontSize: 15,
    color: '#475467',
  },
  carouselRow: {
    marginTop: 10,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 210,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e4e7ec',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 24, 40, 0.32)',
  },
  carouselTextWrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
  },
  carouselTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 22,
  },
  carouselSubtitle: {
    color: '#f2f4f7',
    fontSize: 13,
    marginTop: 2,
  },
  dotRow: {
    marginTop: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: '#101826',
    width: 18,
  },
  dotInactive: {
    backgroundColor: '#d0d5dd',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  buttonBase: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: '#101826',
    borderColor: '#101826',
    flex: 1,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#d0d5dd',
    flex: 1,
  },
  buttonSecondaryText: {
    color: '#101826',
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eaecf0',
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#101826',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 8,
  },
  cardText: {
    color: '#344054',
    fontSize: 14,
    marginBottom: 3,
  },
  cardMuted: {
    color: '#667085',
    fontSize: 13,
    marginTop: 3,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
  },
  tagText: {
    color: '#344054',
    fontSize: 13,
    fontWeight: '600',
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 24,
    color: '#101826',
    fontWeight: '800',
  },
  loader: {
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eaecf0',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  productBody: {
    padding: 12,
  },
  productTag: {
    color: '#667085',
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    color: '#101826',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  productPrice: {
    color: '#2f6f55',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 10,
  },
  smallButton: {
    paddingVertical: 9,
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    marginBottom: 10,
    color: '#101826',
  },
});

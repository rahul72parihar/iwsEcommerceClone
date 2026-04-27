 import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api.js';
import ProductCard from '../components/ProductCard';
import '../styles/SearchPage.css';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query || '');
  const [inputFocused, setInputFocused] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await apiService.getAllProducts();

      let products = [];
      if (response.status === 'success' && response.data) {
        products = response.data;
      }

      const lowerQuery = searchQuery.toLowerCase().trim();
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.title?.toLowerCase().includes(lowerQuery) ||
        product.category?.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery)||
        lowerQuery === 'shoe' && product.category === 'SHOES'
      );
      
      setAllProducts(products);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Search error:', error);
      // Same mock fallback
      const lowerQuery = searchQuery.toLowerCase().trim();
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
      );
      setAllProducts(mockProducts);
      setFilteredProducts(filtered);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const handleMobileSearch = () => {
    const newQuery = localQuery.trim();
    if (newQuery) {
      setSearchParams({ q: newQuery });
      setShowInput(false);
      setLocalQuery('');
    }
  };

  const handleQueryChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const [showInput, setShowInput] = useState(!query);

  if (showInput) {
    return (
      <main className="searchMain">
        <div className="searchEmpty">
          <h1>🔍 Search Products</h1>
          <p>Enter your search term below:</p>
          <div className="mobileSearchInput">
            <input
              type="text"
              placeholder="Type 'shoe' for shoes..."
              value={inputFocused ? localQuery : query || localQuery}
              onChange={handleQueryChange}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleMobileSearch()}
              className="searchInputMobile"
            />
            <button onClick={handleMobileSearch} className="searchButtonMobile">
              Search
            </button>
          </div>
        </div>
      </main>
    );
  }
  if (!query && !localQuery) {
    return (
      <main className="searchMain">
        <div className="searchEmpty">
          <h1>🔍 Search Products</h1>
          <p>Enter your search term below:</p>
          <div className="mobileSearchInput">
            <input
              type="text"
              placeholder="Type 'shoe' for shoes..."
              value={localQuery}
              onChange={handleQueryChange}
              className="searchInputMobile"
            />
            <button onClick={handleMobileSearch} className="searchButtonMobile">
              Search
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="searchMain">
      <div className="searchHero">
        <div className="searchInputResults">
            <input
              type="text"
              placeholder="Search again..."
              value={inputFocused ? localQuery : query || localQuery}
              onChange={handleQueryChange}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleMobileSearch()}
              className="searchInputResultsField"
            />
          <button onClick={handleMobileSearch} className="searchButtonResults">
            🔍
          </button>
        </div>
        <h1 className="searchTitle">SEARCH RESULTS</h1>
        <div className="searchQuery">for "{query}" ({filteredProducts.length})</div>
      </div>
      <div className="searchResultsHeader">
        <h2>{filteredProducts.length} results</h2>
      </div>
      {loading ? (
        <div className="loading">Searching...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="noResults">
          <h3>No products found for "{query}"</h3>
          <p>Try "shoe", "men", "dress" - search bar above 👆</p>
        </div>
      ) : (
        <div className="searchProductsGrid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

import React, { useState, useEffect } from 'react'
import { search_icon } from '../assets/assets'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for fresh groceries, organic produce, dairy & more...", 
  suggestions = [
    "Fresh Apples", "Organic Milk", "Whole Wheat Bread", "Bananas", "Chicken Breast",
    "Greek Yogurt", "Avocados", "Spinach", "Basmati Rice", "Olive Oil",
    "Eggs", "Tomatoes", "Onions", "Potatoes", "Cheese", "Salmon", "Broccoli"
  ],
  className = '',
  showSuggestions = true 
}) => {
  const [query, setQuery] = useState('')
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query.trim() && showSuggestions) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredSuggestions(filtered.slice(0, 6)) // Show max 6 suggestions
      setShowSuggestionsList(filtered.length > 0)
    } else {
      setShowSuggestionsList(false)
    }
  }, [query, suggestions, showSuggestions])

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      setIsLoading(true)
      onSearch(searchQuery.trim())
      setShowSuggestionsList(false)
      
      // Simulate search delay
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
    if (e.key === 'Escape') {
      setShowSuggestionsList(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  const handleClearSearch = () => {
    setQuery('')
    setShowSuggestionsList(false)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => query.trim() && setShowSuggestionsList(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-20 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg placeholder-gray-500"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
          <img src={search_icon} alt="Search" className="w-6 h-6" />
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span className="text-sm font-medium">Search</span>
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 font-medium">Popular Searches</div>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-b-0 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-gray-700 font-medium">{suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Advanced search component with filters
export const AdvancedSearchBar = ({ 
  onSearch, 
  categories = ["Fresh Fruits", "Vegetables", "Dairy", "Meat & Seafood", "Bakery", "Beverages", "Snacks", "Frozen Foods"],
  priceRange = { min: 0, max: 500 },
  onFilterChange 
}) => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPrice, setMinPrice] = useState(priceRange.min)
  const [maxPrice, setMaxPrice] = useState(priceRange.max)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')

  const handleSearch = () => {
    const filters = {
      query: query.trim(),
      category: selectedCategory,
      priceRange: { min: minPrice, max: maxPrice },
      sortBy: sortBy
    }
    onSearch(filters)
    onFilterChange && onFilterChange(filters)
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedCategory('')
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    setSortBy('relevance')
    const filters = {
      query: '',
      category: '',
      priceRange: { min: priceRange.min, max: priceRange.max },
      sortBy: 'relevance'
    }
    onSearch(filters)
    onFilterChange && onFilterChange(filters)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Main Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for fresh groceries, organic produce..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <img src={search_icon} alt="Search" className="w-6 h-6" />
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-medium"
        >
          Search
        </button>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t-2 pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Min Price ($)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Max Price ($)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min="0"
                placeholder="500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar

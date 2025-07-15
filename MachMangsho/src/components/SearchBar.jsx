import React, { useState, useEffect } from 'react'
import { search_icon } from '../assets/assets'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search products...", 
  suggestions = [],
  className = '',
  showSuggestions = false 
}) => {
  const [query, setQuery] = useState('')
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

  useEffect(() => {
    if (query.trim() && showSuggestions) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredSuggestions(filtered.slice(0, 5)) // Show max 5 suggestions
      setShowSuggestionsList(filtered.length > 0)
    } else {
      setShowSuggestionsList(false)
    }
  }, [query, suggestions, showSuggestions])

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setShowSuggestionsList(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
        >
          <img src={search_icon} alt="Search" className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <img src={search_icon} alt="Search" className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Advanced search component with filters
export const AdvancedSearchBar = ({ 
  onSearch, 
  categories = [],
  priceRange = { min: 0, max: 1000 },
  onFilterChange 
}) => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPrice, setMinPrice] = useState(priceRange.min)
  const [maxPrice, setMaxPrice] = useState(priceRange.max)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    const filters = {
      query: query.trim(),
      category: selectedCategory,
      priceRange: { min: minPrice, max: maxPrice }
    }
    onSearch(filters)
    onFilterChange && onFilterChange(filters)
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedCategory('')
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
    const filters = {
      query: '',
      category: '',
      priceRange: { min: priceRange.min, max: priceRange.max }
    }
    onSearch(filters)
    onFilterChange && onFilterChange(filters)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Main Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products..."
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <img src={search_icon} alt="Search" className="w-5 h-5" />
          </button>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

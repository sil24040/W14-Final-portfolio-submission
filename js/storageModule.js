// storageModule.js — handles all localStorage operations

const STORAGE_KEY = 'travelPlanner_destinations';

const StorageModule = {

  // Load destinations from localStorage; if empty, load from JSON file
  async loadDestinations() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // First visit — load starter data from JSON file
    try {
      const response = await fetch('./data/destinations.json');
      const data = await response.json();
      this.saveDestinations(data);
      return data;
    } catch (err) {
      // Fallback: load hardcoded starter data if fetch fails
      const fallback = [
        { id: "1", city: "Paris", country: "France", description: "City of lights.", plannedDate: "2025-06", notes: "Visit the Louvre, walk along the Seine.", visited: false },
        { id: "2", city: "Kyoto", country: "Japan", description: "Ancient capital of Japan.", plannedDate: "2025-09", notes: "See the bamboo groves in Arashiyama.", visited: false },
        { id: "3", city: "Rome", country: "Italy", description: "The Eternal City.", plannedDate: "2024-03", notes: "Tossed a coin in the Trevi Fountain!", visited: true },
        { id: "4", city: "Cape Town", country: "South Africa", description: "Stunning coastal city.", plannedDate: "2026-01", notes: "Hike Table Mountain.", visited: false },
        { id: "5", city: "New York", country: "USA", description: "The city that never sleeps.", plannedDate: "2023-08", notes: "Central Park in fall was magical.", visited: true }
      ];
      this.saveDestinations(fallback);
      return fallback;
    }
  },

  // Save the full destinations array to localStorage
  saveDestinations(destinations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
  },

  // Add a new destination
  addDestination(destination) {
    const destinations = this.getDestinationsSync();
    destination.id = Date.now().toString();
    destinations.push(destination);
    this.saveDestinations(destinations);
    return destination;
  },

  // Update an existing destination by id
  updateDestination(updatedDestination) {
    const destinations = this.getDestinationsSync();
    const index = destinations.findIndex(d => d.id === updatedDestination.id);
    if (index !== -1) {
      destinations[index] = updatedDestination;
      this.saveDestinations(destinations);
    }
  },

  // Delete a destination by id
  deleteDestination(id) {
    const destinations = this.getDestinationsSync();
    const filtered = destinations.filter(d => d.id !== id);
    this.saveDestinations(filtered);
  },

  // Get a single destination by id
  getDestinationById(id) {
    const destinations = this.getDestinationsSync();
    return destinations.find(d => d.id === id) || null;
  },

  // Synchronous read (only works after initial load)
  getDestinationsSync() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Mark a destination as visited or unvisited
  toggleVisited(id) {
    const destinations = this.getDestinationsSync();
    const dest = destinations.find(d => d.id === id);
    if (dest) {
      dest.visited = !dest.visited;
      this.saveDestinations(destinations);
      return dest;
    }
    return null;
  }
};
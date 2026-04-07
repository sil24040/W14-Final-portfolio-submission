const STORAGE_KEY = 'travelPlanner_destinations';
 
const StorageModule = {
 
  // --- localStorage: load destinations ---
  // async/await lets us wait for the fetch to complete before continuing
  async loadDestinations() {
 
    // localStorage.getItem returns null if the key doesn't exist yet
    const stored = localStorage.getItem(STORAGE_KEY);
 
    if (stored) {
      // JSON.parse converts the stored string back into a JavaScript array
      return JSON.parse(stored);
    }
 
    // First visit — try to load starter data from local JSON file using Fetch API
    try {
      const response = await fetch('./data/destinations.json');
 
      // Error handling: if the response failed, throw an error to jump to catch
      if (!response.ok) throw new Error('Failed to load destinations.json');
 
      const data = await response.json();
 
      // 'this' refers to StorageModule — save fetched data to localStorage
      this.saveDestinations(data);
      return data;
 
    } catch (err) {
      // try/catch: handle fetch failure gracefully with hardcoded fallback data
      console.error('Fetch failed, using fallback data:', err);
 
      // Spread syntax (...) used to create clean copies of each destination object
      const fallback = [
        { ...{ id: "1", city: "Paris", country: "France", description: "City of lights.", plannedDate: "2025-06", notes: "Visit the Louvre, walk along the Seine.", visited: false } },
        { ...{ id: "2", city: "Kyoto", country: "Japan", description: "Ancient capital of Japan.", plannedDate: "2025-09", notes: "See the bamboo groves in Arashiyama.", visited: false } },
        { ...{ id: "3", city: "Rome", country: "Italy", description: "The Eternal City.", plannedDate: "2024-03", notes: "Tossed a coin in the Trevi Fountain!", visited: true } },
        { ...{ id: "4", city: "Cape Town", country: "South Africa", description: "Stunning coastal city.", plannedDate: "2026-01", notes: "Hike Table Mountain.", visited: false } },
        { ...{ id: "5", city: "New York", country: "USA", description: "The city that never sleeps.", plannedDate: "2023-08", notes: "Central Park in fall was magical.", visited: true } }
      ];
 
      this.saveDestinations(fallback);
      return fallback;
    }
  },
 
  // --- localStorage: save ---
  // JSON.stringify converts the JavaScript array into a string for storage
  saveDestinations(destinations) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
  },
 
  // --- Add a new destination ---
  // Spread syntax merges the new id into the destination object
  addDestination(destination) {
    const destinations = this.getDestinationsSync();
 
    // Date.now() creates a unique numeric id based on current timestamp
    const newDestination = { ...destination, id: Date.now().toString() };
    destinations.push(newDestination);
 
    this.saveDestinations(destinations);
    return newDestination;
  },
 
  // --- Update an existing destination by id ---
  // Higher-order function: .findIndex() locates the item by id
  updateDestination(updatedDestination) {
    const destinations = this.getDestinationsSync();
    const index = destinations.findIndex(d => d.id === updatedDestination.id);
 
    if (index !== -1) {
      // Spread syntax merges the updated fields into the existing object
      destinations[index] = { ...destinations[index], ...updatedDestination };
      this.saveDestinations(destinations);
    }
  },
 
  // --- Delete a destination by id ---
  // Higher-order function: .filter() returns a new array without the deleted item
  deleteDestination(id) {
    const destinations = this.getDestinationsSync();
    const filtered = destinations.filter(d => d.id !== id);
    this.saveDestinations(filtered);
  },
 
  // --- Get a single destination by id ---
  // Higher-order function: .find() returns the first matching item
  getDestinationById(id) {
    const destinations = this.getDestinationsSync();
    return destinations.find(d => d.id === id) || null;
  },
 
  // --- Synchronous read from localStorage ---
  // Used when data is already loaded and we don't need async
  getDestinationsSync() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },
 
  // --- Toggle visited/planned status ---
  // 'this' keyword and direct object property mutation
  toggleVisited(id) {
    const destinations = this.getDestinationsSync();
    const dest = destinations.find(d => d.id === id);
 
    if (dest) {
      dest.visited = !dest.visited; // flip the boolean value
      this.saveDestinations(destinations);
      return dest;
    }
    return null;
  }
 
};
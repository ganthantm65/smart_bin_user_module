export const USER_DATA = {
  username: "citizen123",  
  password: "password123", 
  name: "You",
  greenPoints: 2740,
  rank: 4,
  zone: "Anna Nagar",
  streak: 7,
  kgDiverted: 84.2,
  co2Saved: 31.6,
  disposals: 127,
  leaderboard: [
    { id: 1, name: "Priya K.", zone: "Anna Nagar", points: 4820 },
    { id: 2, name: "Rajan M.", zone: "Palayamkottai", points: 4310 },
    { id: 3, name: "Deepa S.", zone: "Melapalayam", points: 3990 },
    { id: 4, name: "You", zone: "Anna Nagar", points: 2740, isUser: true },
    { id: 5, name: "Karthik R.", zone: "Anna Nagar", points: 2580 },
  ]
};

export const WASTE_UNITS = [
  {
    id: 'U-101',
    location: 'Palayamkottai Junction',
    distance: '340m',
    status: 'Active',
    coordinate: { latitude: 8.7176, longitude: 77.7431 }, // Tirunelveli coords
    bins: [
      { id: 'bd', type: 'Organic', fillLevel: 71, status: 'Filling Up', icon: 'leaf-outline', color: '#2ecc71' },
      { id: 'nbd', type: 'Recyclable', fillLevel: 45, status: 'Available', icon: 'sync-outline', color: '#3498db' },
      { id: 'ewaste', type: 'E-Waste', fillLevel: 95, status: 'Full', icon: 'hardware-chip-outline', color: '#f39c12' },
      { id: 'medical', type: 'Hazardous', fillLevel: 20, status: 'Available', icon: 'warning-outline', color: '#e74c3c' }
    ]
  },
  {
    id: 'U-102',
    location: 'Anna Nagar Park',
    distance: '560m',
    status: 'Active',
    coordinate: { latitude: 8.7300, longitude: 77.7100 },
    bins: [
      { id: 'bd', type: 'Organic', fillLevel: 30, status: 'Available', icon: 'leaf-outline', color: '#2ecc71' },
      { id: 'nbd', type: 'Recyclable', fillLevel: 85, status: 'Filling Up', icon: 'sync-outline', color: '#3498db' },
      { id: 'ewaste', type: 'E-Waste', fillLevel: 10, status: 'Available', icon: 'hardware-chip-outline', color: '#f39c12' },
      { id: 'medical', type: 'Hazardous', fillLevel: 5, status: 'Available', icon: 'warning-outline', color: '#e74c3c' }
    ]
  }
];
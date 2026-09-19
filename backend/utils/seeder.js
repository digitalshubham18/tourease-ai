const User = require('../models/User');
const Hotel = require('../models/Hotel');
const { Destination } = require('../models/index');

const destinations = [
  {
    name: 'Taj Mahal, Agra', state: 'Uttar Pradesh',
    description: 'One of the Seven Wonders of the World, the Taj Mahal is an ivory-white marble mausoleum. Built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal, it stands as the pinnacle of Mughal architecture.',
    category: 'heritage', highlights: ['Sunrise view', 'Mughal architecture', 'Yamuna riverfront', 'Garden walks'],
    bestTime: 'October to March', avgTemperature: '15-30°C', rating: 4.9, visitorsPerYear: 8000000,
    tags: ['UNESCO', 'heritage', 'romance', 'history'], nearbyAttractions: ['Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh'],
    isFeatured: true, safetyRating: 4, coordinates: { lat: 27.1751, lng: 78.0421 },
    mainImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
  },
  {
    name: 'Kerala Backwaters', state: 'Kerala',
    description: 'The Kerala backwaters are a network of interconnected canals, rivers, lakes and inlets formed by more than 1500 km of waterways. Houseboat cruises are one of Kerala\'s greatest highlights.',
    category: 'wellness', highlights: ['Houseboat cruise', 'Village life', 'Coconut groves', 'Fresh seafood'],
    bestTime: 'September to March', avgTemperature: '22-32°C', rating: 4.8, visitorsPerYear: 3000000,
    tags: ['backwaters', 'houseboat', 'nature', 'ayurveda'], nearbyAttractions: ['Alleppey Beach', 'Kumarakom Bird Sanctuary', 'Vembanad Lake'],
    isFeatured: true, safetyRating: 5, coordinates: { lat: 9.4981, lng: 76.3388 },
    mainImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
  },
  {
    name: 'Rajasthan Desert', state: 'Rajasthan',
    description: 'The Thar Desert forms a natural boundary between India and Pakistan. Experience camel safaris, sand dunes, and the royal culture of Rajasthan.',
    category: 'adventure', highlights: ['Camel safari', 'Sand dunes', 'Folk music', 'Star gazing'],
    bestTime: 'October to February', avgTemperature: '10-25°C', rating: 4.7, visitorsPerYear: 5000000,
    tags: ['desert', 'adventure', 'culture', 'royal'], nearbyAttractions: ['Jaisalmer Fort', 'Sam Sand Dunes', 'Patwon Ki Haveli'],
    isFeatured: true, safetyRating: 4, coordinates: { lat: 26.9124, lng: 70.9116 },
    mainImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
  },
  {
    name: 'Goa Beaches', state: 'Goa',
    description: 'Goa is a state in western India with coastlines stretching along the Arabian Sea. Its preserved 17th-century churches and tropical spice plantations are famous worldwide.',
    category: 'beach', highlights: ['Baga Beach', 'Water sports', 'Nightlife', 'Portuguese heritage'],
    bestTime: 'November to February', avgTemperature: '25-32°C', rating: 4.6, visitorsPerYear: 7000000,
    tags: ['beach', 'party', 'water sports', 'seafood'], nearbyAttractions: ['Basilica of Bom Jesus', 'Dudhsagar Falls', 'Anjuna Flea Market'],
    isFeatured: true, safetyRating: 4, coordinates: { lat: 15.2993, lng: 74.124 },
    mainImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
  },
  {
    name: 'Himalayan Valleys', state: 'Himachal Pradesh',
    description: 'The Kullu-Manali valley is one of the most beautiful mountain valleys in the Himalayas. Surrounded by towering peaks and crystal-clear rivers.',
    category: 'mountain', highlights: ['Snow peaks', 'Trekking', 'Skiing', 'River rafting'],
    bestTime: 'March to June, September to November', avgTemperature: '-5 to 20°C', rating: 4.8, visitorsPerYear: 4000000,
    tags: ['mountains', 'snow', 'trekking', 'adventure'], nearbyAttractions: ['Rohtang Pass', 'Hadimba Temple', 'Solang Valley'],
    isFeatured: true, safetyRating: 3, coordinates: { lat: 32.2396, lng: 77.1887 },
    mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    name: 'Varanasi Ghats', state: 'Uttar Pradesh',
    description: 'Varanasi is one of the world\'s oldest continuously inhabited cities and considered the spiritual capital of India. The ghats along the Ganges are a mesmerizing sight.',
    category: 'religious', highlights: ['Ganga Aarti', 'Ghats walk', 'Boat ride', 'Silk shopping'],
    bestTime: 'October to March', avgTemperature: '10-40°C', rating: 4.7, visitorsPerYear: 6000000,
    tags: ['spiritual', 'culture', 'ghats', 'heritage'], nearbyAttractions: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Sarnath'],
    isFeatured: true, safetyRating: 4, coordinates: { lat: 25.3176, lng: 82.9739 },
    mainImage: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800',
  },
];

const hotelData = [
  // GOA HOTELS
  {
    name: 'Grand Hyatt Goa', location: { address: 'Bambolim, NH 17B', city: 'Goa', state: 'Goa', country: 'India', pincode: '403206' },
    category: 'luxury', pricePerNight: 18500,
    description: 'Grand Hyatt Goa is a spectacular luxury resort nestled along the Bambolim Bay. Featuring multiple swimming pools, world-class dining, a stunning spa, and direct beach access, this resort defines luxury on the Goan coast.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Beach Access', 'Water Sports', 'Kids Club', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    rating: { average: 4.8, count: 612 }, featured: true, isVerified: true,
    tags: ['luxury', 'beach', 'resort', 'goa'], totalRooms: 250, availableRooms: 45,
    policies: { checkIn: '15:00', checkOut: '12:00', cancellation: 'Free cancellation 48h before check-in', petFriendly: false, smokingAllowed: false },
    coordinates: { lat: 15.4638, lng: 73.8286 },
  },
  {
    name: 'Zostel Goa Anjuna', location: { address: 'Anjuna Beach Road', city: 'Anjuna', state: 'Goa', country: 'India', pincode: '403509' },
    category: 'hostel', pricePerNight: 750,
    description: 'India\'s most loved hostel chain in the heart of Anjuna. Perfect social atmosphere for backpackers with clean dorms, a vibrant common area, and organized beach trips. Just 5 minutes walk from Anjuna Beach.',
    amenities: ['Free WiFi', 'Common Kitchen', 'Lounge', 'Bike Rental', 'Tours', 'Lockers', 'Rooftop'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    rating: { average: 4.5, count: 1892 }, featured: false, isVerified: true,
    tags: ['hostel', 'budget', 'backpacker', 'beach'], totalRooms: 30, availableRooms: 12,
    policies: { checkIn: '12:00', checkOut: '10:00', cancellation: 'Free cancellation 24h before', petFriendly: false, smokingAllowed: false },
  },
  {
    name: 'Novotel Goa Resort & Spa', location: { address: 'Candolim Beach Road', city: 'Candolim', state: 'Goa', country: 'India', pincode: '403515' },
    category: 'resort', pricePerNight: 8500,
    description: 'Situated near the pristine Candolim Beach, Novotel Goa offers a perfect blend of comfort and leisure. The resort features tropical gardens, multiple dining options, and a luxurious spa.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Beach Shuttle', 'Kids Club'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    rating: { average: 4.4, count: 847 }, featured: true, isVerified: true,
    tags: ['resort', 'beach', 'family', 'goa'], totalRooms: 185, availableRooms: 32,
    policies: { checkIn: '14:00', checkOut: '12:00', cancellation: 'Free cancellation 24h before', petFriendly: false, smokingAllowed: false },
  },
  // AGRA HOTELS
  {
    name: 'The Oberoi Amarvilas Agra', location: { address: 'Taj East Gate Road', city: 'Agra', state: 'Uttar Pradesh', country: 'India', pincode: '282001' },
    category: 'luxury', pricePerNight: 38000,
    description: 'Experience unparalleled luxury with every room offering a stunning view of the Taj Mahal. This award-winning hotel features Mughal-inspired architecture, world-class dining, rejuvenating spa treatments, and butler service.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Concierge', 'Airport Transfer', 'Butler Service', 'Taj View'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    rating: { average: 4.9, count: 423 }, featured: true, isVerified: true,
    tags: ['luxury', 'taj view', 'heritage', 'agra'], totalRooms: 102, availableRooms: 18,
    policies: { checkIn: '14:00', checkOut: '12:00', cancellation: 'Free cancellation 48h before', petFriendly: false, smokingAllowed: false },
  },
  {
    name: 'Trident Agra', location: { address: 'Taj Nagari Phase II', city: 'Agra', state: 'Uttar Pradesh', country: 'India', pincode: '282001' },
    category: 'deluxe', pricePerNight: 9500,
    description: 'A thoughtfully designed luxury hotel surrounded by beautiful Mughal gardens. Just 500m from the Taj Mahal\'s East Gate, Trident Agra offers spacious rooms, signature dining, and a serene outdoor pool.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Garden View', 'Gym', 'Concierge', 'Bicycle Rental'],
    images: ['https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    rating: { average: 4.6, count: 538 }, featured: false, isVerified: true,
    tags: ['luxury', 'taj view', 'heritage'], totalRooms: 139, availableRooms: 28,
  },
  // KERALA HOTELS
  {
    name: 'Kumarakom Lake Resort', location: { address: 'Kumarakom North', city: 'Kumarakom', state: 'Kerala', country: 'India', pincode: '686563' },
    category: 'resort', pricePerNight: 17000,
    description: 'Nestled on the banks of Vembanad Lake, this 5-star resort offers authentic Kerala backwater experience with traditional architecture, Ayurvedic treatments, houseboat cruises, and stunning sunset views.',
    amenities: ['Free WiFi', 'Private Pool', 'Ayurvedic Spa', 'Restaurant', 'Houseboat', 'Yoga', 'Canoe', 'Lake View', 'Butler Service'],
    images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    rating: { average: 4.8, count: 287 }, featured: true, isVerified: true,
    tags: ['backwaters', 'ayurveda', 'resort', 'kerala'], totalRooms: 72, availableRooms: 14,
    policies: { checkIn: '14:00', checkOut: '11:00', cancellation: 'Free cancellation 48h before', petFriendly: false, smokingAllowed: false },
  },
  {
    name: 'The Windflower Resort & Spa Coorg', location: { address: 'Kabbinakad Estate', city: 'Coorg', state: 'Karnataka', country: 'India', pincode: '571232' },
    category: 'resort', pricePerNight: 7200,
    description: 'Set amidst lush coffee and spice plantations in the scenic hills of Coorg, this luxury resort offers breathtaking views, a world-class spa, and an immersive nature experience.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Nature Walks', 'Plantation Tour', 'Yoga', 'Bonfire'],
    images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    rating: { average: 4.6, count: 319 }, featured: false, isVerified: true,
    tags: ['resort', 'plantation', 'nature', 'coorg'], totalRooms: 60, availableRooms: 20,
  },
  // RAJASTHAN HOTELS
  {
    name: 'The Leela Palace Udaipur', location: { address: 'Lake Pichola', city: 'Udaipur', state: 'Rajasthan', country: 'India', pincode: '313001' },
    category: 'luxury', pricePerNight: 28000,
    description: 'Experience royal Rajasthani hospitality at this magnificent palace hotel on Lake Pichola. With opulent interiors inspired by the royal courts, private pools, multiple restaurants, and lake-facing rooms, this is a palace dream.',
    amenities: ['Free WiFi', 'Multiple Pools', 'Luxury Spa', '5 Restaurants', 'Bar', 'Heritage Tours', 'Boating', 'Lake View', 'Butler Service'],
    images: ['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
    rating: { average: 4.9, count: 389 }, featured: true, isVerified: true,
    tags: ['palace', 'luxury', 'rajasthan', 'lake view'], totalRooms: 153, availableRooms: 22,
    policies: { checkIn: '15:00', checkOut: '12:00', cancellation: 'Free cancellation 72h before', petFriendly: false, smokingAllowed: false },
  },
  {
    name: 'Ratan Vilas Heritage Hotel', location: { address: 'Lalghat Area', city: 'Udaipur', state: 'Rajasthan', country: 'India', pincode: '313001' },
    category: 'boutique', pricePerNight: 3500,
    description: 'A charming heritage haveli turned boutique hotel in the heart of Udaipur\'s old city. Authentic Rajasthani decor, rooftop restaurant with lake views, and warm hospitality make this a hidden gem.',
    amenities: ['Free WiFi', 'Rooftop Restaurant', 'Lake View', 'Heritage Tours', 'Cultural Shows', 'Cycling'],
    images: ['https://images.unsplash.com/photo-1609767160270-7a2d44451024?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1609767160270-7a2d44451024?w=800',
    rating: { average: 4.5, count: 674 }, featured: false, isVerified: true,
    tags: ['heritage', 'boutique', 'budget', 'udaipur'], totalRooms: 20, availableRooms: 8,
  },
  {
    name: 'Suryagarh Jaisalmer', location: { address: 'Kahala Phata, Sam Road', city: 'Jaisalmer', state: 'Rajasthan', country: 'India', pincode: '345001' },
    category: 'luxury', pricePerNight: 14000,
    description: 'A magnificent fortress-like luxury hotel on the outskirts of Jaisalmer, featuring desert views, opulent suites, an exquisite spa, camel safaris, and traditional Rajasthani cultural evenings under the stars.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Desert Spa', 'Restaurant', 'Camel Safari', 'Cultural Shows', 'Jeep Safari', 'Star Gazing'],
    images: ['https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800',
    rating: { average: 4.8, count: 251 }, featured: true, isVerified: true,
    tags: ['luxury', 'desert', 'heritage', 'jaisalmer'], totalRooms: 64, availableRooms: 15,
  },
  // MANALI / HIMACHAL
  {
    name: 'Snow Valley Resort Manali', location: { address: 'Old Manali Road', city: 'Manali', state: 'Himachal Pradesh', country: 'India', pincode: '175131' },
    category: 'resort', pricePerNight: 6200,
    description: 'A cozy mountain retreat nestled in the lap of the Himalayas with breathtaking mountain views. Perfect for adventure seekers — easy access to trekking trails, skiing slopes, and river rafting on the Beas.',
    amenities: ['Free WiFi', 'Mountain View', 'Restaurant', 'Bonfire', 'Trekking Guide', 'Skiing', 'River Rafting', 'Parking'],
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    rating: { average: 4.6, count: 543 }, featured: true, isVerified: true,
    tags: ['mountain', 'snow', 'adventure', 'manali'], totalRooms: 45, availableRooms: 16,
    policies: { checkIn: '13:00', checkOut: '11:00', cancellation: 'Free cancellation 24h before', petFriendly: true, smokingAllowed: false },
  },
  {
    name: 'The Himalayan Hotel Manali', location: { address: 'Near Mall Road', city: 'Manali', state: 'Himachal Pradesh', country: 'India', pincode: '175131' },
    category: 'standard', pricePerNight: 2800,
    description: 'A well-situated comfortable hotel in the heart of Manali, walking distance from Mall Road. Clean rooms with mountain views, a cozy restaurant serving authentic Himachali cuisine, and helpful staff.',
    amenities: ['Free WiFi', 'Restaurant', 'Mountain View', 'Room Service', 'Parking', 'Tour Desk'],
    images: ['https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800',
    rating: { average: 4.2, count: 438 }, featured: false, isVerified: true,
    tags: ['standard', 'mountain', 'budget', 'manali'], totalRooms: 35, availableRooms: 11,
  },
  // MUMBAI
  {
    name: 'Taj Mahal Palace Mumbai', location: { address: 'Apollo Bunder', city: 'Mumbai', state: 'Maharashtra', country: 'India', pincode: '400001' },
    category: 'luxury', pricePerNight: 32000,
    description: 'An iconic 5-star landmark overlooking the Gateway of India. This century-old luxury hotel is a blend of Saracenic and Florentine styles offering stunning sea views, world-class restaurants, and unmatched service.',
    amenities: ['Free WiFi', 'Multiple Pools', 'Spa', '10 Restaurants', 'Sea View', 'Business Center', 'Butler Service', 'Heritage Tours'],
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    rating: { average: 4.9, count: 1204 }, featured: true, isVerified: true,
    tags: ['luxury', 'heritage', 'sea view', 'mumbai'], totalRooms: 285, availableRooms: 42,
    policies: { checkIn: '15:00', checkOut: '12:00', cancellation: 'Free cancellation 72h before', petFriendly: false, smokingAllowed: false },
  },
  {
    name: 'Backpacker Panda Mumbai', location: { address: 'Colaba Causeway', city: 'Mumbai', state: 'Maharashtra', country: 'India', pincode: '400005' },
    category: 'hostel', pricePerNight: 650,
    description: 'Trendy hostel in the heart of Colaba, Mumbai\'s most vibrant neighborhood. Perfect for solo travelers with social events, local tours, air-conditioned dorms, and private rooms. Near Gateway of India.',
    amenities: ['Free WiFi', 'Common Area', 'Lockers', 'Tours', 'Breakfast', 'Rooftop'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    rating: { average: 4.4, count: 987 }, featured: false, isVerified: true,
    tags: ['hostel', 'budget', 'colaba', 'mumbai'], totalRooms: 25, availableRooms: 9,
  },
  // DELHI
  {
    name: 'The Imperial New Delhi', location: { address: 'Janpath Lane', city: 'New Delhi', state: 'Delhi', country: 'India', pincode: '110001' },
    category: 'luxury', pricePerNight: 22000,
    description: 'A landmark luxury hotel dating back to 1931, blending colonial heritage with modern luxury. Home to the finest art collection among Indian hotels, world-class restaurants, and a spectacular spa.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', '5 Restaurants', 'Art Gallery', 'Tennis Court', 'Business Center', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1455587734955-081b22074882?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800',
    rating: { average: 4.8, count: 876 }, featured: true, isVerified: true,
    tags: ['luxury', 'heritage', 'colonial', 'delhi'], totalRooms: 234, availableRooms: 38,
    policies: { checkIn: '14:00', checkOut: '12:00', cancellation: 'Free cancellation 48h before', petFriendly: false, smokingAllowed: false },
  },
  {
    name: 'Zostel Delhi Paharganj', location: { address: 'Main Bazar, Paharganj', city: 'New Delhi', state: 'Delhi', country: 'India', pincode: '110055' },
    category: 'hostel', pricePerNight: 599,
    description: 'Centrally located hostel in the famous Paharganj backpacker area of Delhi. Perfect starting point to explore the capital with guided city tours, vibrant common rooms, and great food nearby.',
    amenities: ['Free WiFi', 'Common Kitchen', 'Lounge', 'Tours', 'Lockers', 'Air Conditioning'],
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    rating: { average: 4.3, count: 1543 }, featured: false, isVerified: true,
    tags: ['hostel', 'budget', 'paharganj', 'delhi'], totalRooms: 40, availableRooms: 14,
  },
  // BANGALORE
  {
    name: 'The Leela Palace Bangalore', location: { address: '23 Airport Road', city: 'Bangalore', state: 'Karnataka', country: 'India', pincode: '560008' },
    category: 'luxury', pricePerNight: 16500,
    description: 'A magnificent palace hotel blending traditional Indian architecture with modern luxury. Features opulent rooms, multiple dining experiences, a world-class spa, and is perfectly positioned for business and leisure.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Luxury Spa', '4 Restaurants', 'Bar', 'Gym', 'Business Center', 'Concierge', 'Valet'],
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    rating: { average: 4.8, count: 692 }, featured: true, isVerified: true,
    tags: ['luxury', 'business', 'palace', 'bangalore'], totalRooms: 357, availableRooms: 60,
  },
  // JAIPUR
  {
    name: 'Samode Haveli Jaipur', location: { address: 'Gangapole', city: 'Jaipur', state: 'Rajasthan', country: 'India', pincode: '302002' },
    category: 'boutique', pricePerNight: 8900,
    description: 'A 475-year-old ancestral haveli in the heart of the Pink City, converted into a luxury heritage hotel. Experience royal Rajputana hospitality with hand-painted frescoes, courtyard pools, and authentic cuisine.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Heritage Architecture', 'Restaurant', 'Bar', 'Cultural Shows', 'Roof Terrace', 'Spa'],
    images: ['https://images.unsplash.com/photo-1609767160270-7a2d44451024?w=800'],
    mainImage: 'https://images.unsplash.com/photo-1609767160270-7a2d44451024?w=800',
    rating: { average: 4.7, count: 312 }, featured: true, isVerified: true,
    tags: ['heritage', 'boutique', 'palace', 'jaipur'], totalRooms: 39, availableRooms: 10,
  },
];

exports.seedData = async () => {
  try {
    const destCount = await Destination.countDocuments();
    if (destCount === 0) {
      await Destination.insertMany(destinations);
      console.log('✅ Destinations seeded');
    }

    // Create admin
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'TourEase Admin', email: process.env.ADMIN_EMAIL || 'admin@tourease.ai',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin', isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&bold=true&size=128',
        phone: '+91 98765 00001', bio: 'Platform Administrator',
        location: { city: 'New Delhi', state: 'Delhi', country: 'India' },
      });
      console.log('✅ Admin user created:', admin.email);
    }

    // Create hotel owners
    const ownerProfiles = [
      { name: 'Rajesh Kumar Sharma', email: 'owner@tourease.ai', phone: '+91 98765 43210', avatar: 'https://ui-avatars.com/api/?name=Rajesh+Sharma&background=8b5cf6&color=fff&bold=true&size=128', bio: 'Hospitality professional with 15 years experience managing luxury hotels across India.', city: 'Goa', state: 'Goa' },
      { name: 'Priya Patel', email: 'priya.owner@tourease.ai', phone: '+91 87654 32109', avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=ec4899&color=fff&bold=true&size=128', bio: 'Heritage hotel specialist passionate about preserving Indian architectural history through hospitality.', city: 'Udaipur', state: 'Rajasthan' },
      { name: 'Suresh Nair', email: 'suresh.owner@tourease.ai', phone: '+91 76543 21098', avatar: 'https://ui-avatars.com/api/?name=Suresh+Nair&background=06b6d4&color=fff&bold=true&size=128', bio: 'Kerala resort owner with 20 years of backwater hospitality experience.', city: 'Kochi', state: 'Kerala' },
    ];

    const owners = [];
    for (const profile of ownerProfiles) {
      let owner = await User.findOne({ email: profile.email });
      if (!owner) {
        owner = await User.create({
          name: profile.name, email: profile.email, password: 'Owner@123456',
          role: 'hotel_owner', isEmailVerified: true, avatar: profile.avatar,
          phone: profile.phone, bio: profile.bio,
          location: { city: profile.city, state: profile.state, country: 'India' },
        });
      }
      owners.push(owner);
    }
    console.log('✅ Hotel owners ready');

    // Seed hotels
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      const distributed = hotelData.map((h, i) => ({
        ...h,
        owner: owners[i % owners.length]._id,
        coordinates: h.coordinates || { lat: 20.5937 + (i * 0.5), lng: 78.9629 + (i * 0.3) },
      }));
      await Hotel.insertMany(distributed);
      console.log(`✅ ${distributed.length} Hotels seeded`);
    }

    // Create sample tourist
    const touristExists = await User.findOne({ email: 'tourist@demo.com' });
    if (!touristExists) {
      await User.create({
        name: 'Aarav Mehta', email: 'tourist@demo.com', password: 'Demo@1234',
        role: 'tourist', isEmailVerified: true,
        avatar: 'https://ui-avatars.com/api/?name=Aarav+Mehta&background=10b981&color=fff&bold=true&size=128',
        phone: '+91 99887 76655', bio: 'Avid traveler exploring the beauty of India one city at a time.',
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
      });
      console.log('✅ Demo tourist created');
    }
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
  }
};

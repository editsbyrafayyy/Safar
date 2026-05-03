export type Destination = {
	id: string;
	title: string;
	subtitle: string;
	imageUri: string;
	badge?: string;
};

export type DNAProfile = {
	heritage: number;
	culinary: number;
	urban: number;
	nature: number;
	adventure: number;
	relaxation: number;
};

export type ExploreJourney = {
	title: string;
	description: string;
	image: string;
	matchCount: number;
	subtitle?: string;
};

export type VicinityTraveler = {
	id: string;
	name: string;
	location: string;
	avatar: string;
};

export type MatchProfile = {
	id: string;
	name: string;
	age: number;
	location: string;
	avatar: string;
	matchPct: number;
	bio: string;
	tags: string[];
};

export type SwipeTraveler = {
	id: string;
	name: string;
	age: number;
	city: string;
	photo: string;
	bio: string;
	compatibility: number;
	travelStyle: string[];
	traits: { Adventure: number; Culture: number; Budget: number; Social: number };
	pastDestinations: string[];
	mutualMatch: boolean;
	verified?: boolean;
};

export type MockUser = {
	name: string;
	title: string;
	countries: number;
	trips: number;
	followers: number;
	is2FAEnabled: boolean;
	isFaceIDEnabled: boolean;
};

export type MockTrip = {
	id: string;
	title: string;
	destination: string;
	heroImage: string;
	dates: string;
	daysLeft: number;
	year: string;
	subtitle: string;
	hotel: string;
	stops: number;
};

export type MockJourney = {
	id: string;
	title: string;
	status: string;
	heroImage: string;
	dates: string;
	destination: string;
	distanceKM?: number;
	gearAdvisory: string;
	visaUpdate: string;
};

export type MockExpenseItem = {
	id: string;
	name: string;
	paidBy: string;
	category: string;
	amount: number;
	split: string;
};

export type MockExpenses = {
	tripTitle: string;
	totalGroupSpend: number;
	yourBalance: number;
	pendingSettlements: number;
	items: MockExpenseItem[];
};

export type MockVibeMessage = {
	id: string;
	sender: string;
	avatar: string;
	text: string;
	time: string;
	isMine: boolean;
	type: "text" | "poll" | "image";
	poll?: {
		question: string;
		options: { label: string; votes: number }[];
	};
	imageUrl?: string;
};

export type MockTraveler = {
	curationNo: string;
	name: string;
	bio: string;
	avatar: string;
	destinations: number;
	passportAge: string;
	travelStyle: string;
	pace: string;
	manifesto: string;
	tags: string[];
	currentCity: string;
	latestFind: {
		image: string;
		title: string;
		subtitle: string;
	};
	personaDNA: { label: string; value: number; side: string }[];
};

export type MockAgency = {
	id: string;
	name: string;
	region: string;
	rating: number;
	heroImage: string;
	startingPrice: number;
	description?: string;
	avatars?: string[];
	verified?: boolean;
};

export type MockEmergencyContact = {
	id: string;
	name: string;
	relationship: string;
	phone: string;
};

export type MockLocalAuthority = {
	id: string;
	name: string;
	type: string;
	phone: string;
};

export type CostComparisonRow = {
	item: string;
	soloCost: number;
	agencyCost: number;
};

export type MockCostComparison = {
	destination: string;
	duration: string;
	groupSize: number;
	rows: CostComparisonRow[];
};

export type MockAgencyItinerary = {
	id: string;
	title: string;
	image: string;
	price: number;
	date: string;
	duration: number;
	tags: string[];
};

export type MockAgencyDetail = {
	id: string;
	name: string;
	heroImage: string;
	rating: number;
	reviewCount: number;
	philosophy: string;
	specialization: string;
	certification: string;
	startingPrice: number;
	officeAddress: string;
	phone: string;
	email: string;
	itineraries: MockAgencyItinerary[];
};

export type MockDestination = {
	id: string;
	name: string;
	region: string;
	heroImage: string;
	duration: string;
	difficulty: 'Easy' | 'Moderate' | 'Challenging';
	highlights: string[];
	bestMonths: string[];
	soloEstimate: number;
	agencyEstimate: number;
	agencyIds: string[];
};

export const MOCK_DESTINATIONS: MockDestination[] = [
	{
		id: 'hunza-valley',
		name: 'Hunza Valley',
		region: 'Gilgit-Baltistan, Pakistan',
		heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
		duration: '7–10 Days',
		difficulty: 'Moderate',
		highlights: ['Baltit Fort', 'Attabad Lake', "Eagle's Nest Viewpoint", 'Karimabad Bazaar', 'Rakaposhi Base Camp'],
		bestMonths: ['April', 'May', 'June', 'September', 'October'],
		soloEstimate: 95000,
		agencyEstimate: 185000,
		agencyIds: ['atlas-nomad-co', 'silk-route-collective'],
	},
	{
		id: 'swat-valley',
		name: 'Swat Valley',
		region: 'Khyber Pakhtunkhwa, Pakistan',
		heroImage: 'https://images.unsplash.com/photo-1504900954325-23c46b4ce8df?auto=format&fit=crop&w=1200&q=80',
		duration: '4–6 Days',
		difficulty: 'Easy',
		highlights: ['Mahodand Lake', 'Kalam Valley', 'Fizagat Park', 'Malam Jabba Ski Resort', 'White Palace Museum'],
		bestMonths: ['March', 'April', 'May', 'August', 'September'],
		soloEstimate: 55000,
		agencyEstimate: 98000,
		agencyIds: ['dune-to-peak-travel'],
	},
	{
		id: 'fairy-meadows',
		name: 'Fairy Meadows',
		region: 'Gilgit-Baltistan, Pakistan',
		heroImage: 'https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?auto=format&fit=crop&w=1200&q=80',
		duration: '3–5 Days',
		difficulty: 'Challenging',
		highlights: ['Nanga Parbat Base Camp Trek', 'Raikot Bridge', 'Fairy Meadows Plateau', 'Alpine Wildflowers', 'Sunrise Over Nanga Parbat'],
		bestMonths: ['June', 'July', 'August'],
		soloEstimate: 45000,
		agencyEstimate: 130000,
		agencyIds: ['atlas-nomad-co', 'dune-to-peak-travel'],
	},
];

export const destinations: Destination[] = [
	{
		id: "samarkand",
		title: "Samarkand: The Blue City",
		subtitle: "Tracing the ancient routes of the Silk Road",
		badge: "CACHED",
		imageUri:
			"https://images.unsplash.com/photo-1680242865063-9efb7f27f97c?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "varanasi",
		title: "Varanasi: Eternal City",
		subtitle: "Spiritual heartland with layered heritage",
		imageUri:
			"https://images.unsplash.com/photo-1596881324451-600e1cb9f9d4?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "petra",
		title: "Petra: The Rose City",
		subtitle: "Archaeology-led desert route",
		imageUri:
			"https://images.unsplash.com/photo-1579606032821-4e6161c81bd7?auto=format&fit=crop&w=900&q=80",
	},
];

export const currentTrip = {
	title: "The Turquoise Gates",
	status: "Active",
	logs: "8 Archive Logs",
};

export const sampleDNA: DNAProfile = {
	heritage: 0.9,
	culinary: 0.6,
	urban: 0.7,
	nature: 0.5,
	adventure: 0.8,
	relaxation: 0.4,
};

export const matchDNA: DNAProfile = {
	heritage: 0.85,
	culinary: 0.7,
	urban: 0.6,
	nature: 0.6,
	adventure: 0.8,
	relaxation: 0.45,
};

export const MOCK_EXPLORE = {
	featured: {
		id: "hunza-valley",
		title: "Hunza Valley",
		description: "Golden autumn corridors, glacier-fed lakes, and slow heritage trails.",
		region: "NORTHERN PAKISTAN",
		badge: "TRENDING",
		image:
			"https://images.unsplash.com/photo-1609184807049-a8b2e6acda0f?auto=format&fit=crop&w=1200&q=80",
		fallbackImage:
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
		duration: "7 DAYS",
		highlights: ["Glacier-fed lakes", "Heritage trails", "Autumn glow"],
	},
	categories: ["MOUNTAINS", "HERITAGE", "DESERT", "LAKES", "CITY"],
	journeys: [
		{
			id: "swat-valley",
			title: "Karakoram Chronicle",
			description: "High passes, glacier viewpoints, and curated lodge stops.",
			image:
				"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80",
			matchCount: 18,
		},
		{
			id: "fairy-meadows",
			title: "Desert Caravan Nights",
			description: "Sandstone routes, stargazing camps, and craft bazaar detours.",
			image:
				"https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=80",
			subtitle: "SINDH • THAR BELT",
			matchCount: 12,
		},
	],
	vicinityTravelers: [
		{
			id: "1",
			name: "Areeba",
			location: "Skardu",
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
		},
		{
			id: "2",
			name: "Zain",
			location: "Hunza",
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
		},
		{
			id: "3",
			name: "Maha",
			location: "Gilgit",
			avatar:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
		},
	],
};

export const MOCK_MATCHES: MatchProfile[] = [
	{
		id: "amina",
		name: "Amina Al-Farsi",
		age: 29,
		location: "Muscat, Oman",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
		matchPct: 94,
		bio: "Seeking a fellow traveler for a deep-dive into the Silk Road's architectural evolution. I prioritize historical context over standard tourist traps.",
		tags: ["History Buff", "Visual Arts"],
	},
	{
		id: "zain",
		name: "Zain Malik",
		age: 32,
		location: "Lahore, Pakistan",
		avatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
		matchPct: 88,
		bio: "Prefer slow routes, mountain silence, and tea stops with good company.",
		tags: ["Mountain Seekers", "Tea Trail"],
	},
	{
		id: "maha",
		name: "Maha Noor",
		age: 27,
		location: "Gilgit, Pakistan",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
		matchPct: 91,
		bio: "I build itineraries around food markets, heritage streets, and local stories.",
		tags: ["Food Explorer", "Route Sync"],
	},
];

export const MOCK_USER: MockUser = {
	name: "Elias Thorne",
	title: "Curator & Route Collector",
	countries: 14,
	trips: 28,
	followers: 8200,
	is2FAEnabled: true,
	isFaceIDEnabled: false,
};

export const MOCK_TRIPS: MockTrip[] = [
	{
		id: "karakoram-expedition",
		title: "Karakoram Expedition",
		destination: "Hunza Valley",
		heroImage:
			"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
		dates: "12–19 May 2026",
		daysLeft: 12,
		year: "2026",
		subtitle: "Upcoming summit route",
		hotel: "Eagle Nest Resort",
		stops: 6,
	},
	{
		id: "murree-retreat",
		title: "Murree Retreat",
		destination: "Murree",
		heroImage:
			"https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
		dates: "08–11 Jan 2025",
		daysLeft: 0,
		year: "2025",
		subtitle: "Pine valley winter trails",
		hotel: "Pine Crest Lodge",
		stops: 4,
	},
	{
		id: "naran-valley",
		title: "Naran Valley",
		destination: "Kaghan",
		heroImage:
			"https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
		dates: "17–22 Jul 2024",
		daysLeft: 0,
		year: "2024",
		subtitle: "Lakes, meadows and road diaries",
		hotel: "Blue Peak Inn",
		stops: 5,
	},
];

export const MOCK_JOURNEYS: MockJourney[] = [
	{
		id: "karakoram-expedition",
		title: "Karakoram Expedition",
		status: "ACTIVE",
		heroImage:
			"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
		dates: "AUG 12 – AUG 28",
		destination: "Gilgit-Baltistan",
		distanceKM: 1240,
		gearAdvisory: "Temperatures drop sharply after sunset. Add thermal base layers and high-altitude gloves.",
		visaUpdate: "Visa route update: group clearances submitted. 3 approvals already confirmed.",
	},
	{
		id: "annapurna-circuit",
		title: "Annapurna Circuit",
		status: "BOOKING",
		heroImage:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
		dates: "SEP 04 – SEP 18",
		destination: "Nepal",
		gearAdvisory: "Monsoon shoulder season expected. Include rain shell and waterproof trail boots.",
		visaUpdate: "Permit window opens in 5 days.",
	},
];

export const MOCK_EXPENSES: MockExpenses = {
	tripTitle: "Karakoram Expedition",
	totalGroupSpend: 284500,
	yourBalance: 12400,
	pendingSettlements: 3,
	items: [
		{
			id: "exp-1",
			name: "Dinner at Eagle Nest",
			paidBy: "Areeba",
			category: "Dining",
			amount: 18500,
			split: "Split equally",
		},
		{
			id: "exp-2",
			name: "Valley Transfer",
			paidBy: "You",
			category: "Transport",
			amount: 46000,
			split: "Split equally",
		},
		{
			id: "exp-3",
			name: "Lodge Stay",
			paidBy: "Zain",
			category: "Stay",
			amount: 92000,
			split: "By room",
		},
		{
			id: "exp-4",
			name: "Paragliding Session",
			paidBy: "You",
			category: "Activity",
			amount: 28000,
			split: "Only participants",
		},
	],
};

export const MOCK_VIBE_MESSAGES: MockVibeMessage[] = [
	{
		id: "msg-1",
		sender: "Areeba",
		avatar: "https://i.pravatar.cc/80?img=5",
		text: "Sunrise point confirmed. Meet at the hotel lobby by 5:10 AM.",
		time: "09:12 AM",
		isMine: false,
		type: "text",
	},
	{
		id: "msg-2",
		sender: "You",
		avatar: "",
		text: "Perfect. I’ll bring the extra thermos for chai.",
		time: "09:14 AM",
		isMine: true,
		type: "text",
	},
	{
		id: "msg-3",
		sender: "Zain",
		avatar: "https://i.pravatar.cc/80?img=8",
		text: "Vote for tomorrow’s post-hike stop.",
		time: "09:20 AM",
		isMine: false,
		type: "poll",
		poll: {
			question: "Where should we stop after the ridge trail?",
			options: [
				{ label: "Altit Fort", votes: 46 },
				{ label: "Baltit Cafe", votes: 34 },
				{ label: "Duikar Viewpoint", votes: 20 },
			],
		},
	},
	{
		id: "msg-4",
		sender: "Maha",
		avatar: "https://i.pravatar.cc/80?img=4",
		text: "Captured this from yesterday’s pass ✨",
		time: "09:32 AM",
		isMine: false,
		type: "image",
		imageUrl: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
	},
];

export const MOCK_TRAVELER: MockTraveler = {
	curationNo: "CURATION #118",
	name: "Areeba Khan",
	bio: "Route storyteller chasing mountain dawns, tea-house legends, and forgotten heritage lanes.",
	avatar: "https://i.pravatar.cc/200?img=47",
	destinations: 27,
	passportAge: "8 Years",
	travelStyle: "Slow + Heritage",
	pace: "Balanced",
	manifesto:
		"Collect stories, not stamps. Every journey deserves local voices, patient mornings, and room for detours.",
	tags: ["Heritage", "Tea Trails", "Photography", "High Altitude"],
	currentCity: "Hunza, Pakistan",
	latestFind: {
		image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80",
		title: "Eagle Nest Sunrise Point",
		subtitle: "An early-hour ridge with panoramic Karakoram light.",
	},
	personaDNA: [
		{ label: "Culture", value: 88, side: "Tradition" },
		{ label: "Adventure", value: 74, side: "Thrill" },
		{ label: "Comfort", value: 42, side: "Rustic" },
		{ label: "Planning", value: 81, side: "Structured" },
	],
};

export const MOCK_AGENCIES: MockAgency[] = [
	{
		id: "atlas-nomad-co",
		name: "Atlas Nomad Co.",
		region: "Gilgit-Baltistan",
		rating: 4.9,
		heroImage:
			"https://images.unsplash.com/photo-1609184807049-a8b2e6acda0f?auto=format&fit=crop&w=1200&q=80",
		startingPrice: 185000,
		description: "Altitude-focused expeditions with veteran local guides and small curated groups.",
		avatars: [
			"https://i.pravatar.cc/80?img=12",
			"https://i.pravatar.cc/80?img=22",
			"https://i.pravatar.cc/80?img=32",
		],
		verified: true,
	},
	{
		id: "silk-route-collective",
		name: "Silk Route Collective",
		region: "Skardu & Hunza",
		rating: 4.8,
		heroImage:
			"https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
		startingPrice: 162000,
		description: "Story-led journeys across heritage corridors with culture-first itinerary design.",
		avatars: [
			"https://i.pravatar.cc/80?img=4",
			"https://i.pravatar.cc/80?img=14",
			"https://i.pravatar.cc/80?img=24",
		],
		verified: true,
	},
	{
		id: "dune-to-peak-travel",
		name: "Dune to Peak Travel",
		region: "Northern Pakistan",
		rating: 4.7,
		heroImage:
			"https://images.unsplash.com/photo-1531501410720-c8d437636169?auto=format&fit=crop&w=1200&q=80",
		startingPrice: 149000,
		verified: false,
	},
];

export const MOCK_EMERGENCY_CONTACTS: MockEmergencyContact[] = [
	{ id: "ec-1", name: "Sara Khan", relationship: "Sister", phone: "+923001234567" },
	{ id: "ec-2", name: "Ahmed Malik", relationship: "Father", phone: "+923219876543" },
	{ id: "ec-3", name: "Dr. Nadia Raza", relationship: "Family Doctor", phone: "+922134567890" },
];

export const MOCK_LOCAL_AUTHORITIES: MockLocalAuthority[] = [
	{ id: "la-1", name: "Gilgit Police HQ", type: "Police", phone: "+925811920191" },
	{ id: "la-2", name: "DHQ Hospital Gilgit", type: "Hospital", phone: "+925811920091" },
	{ id: "la-3", name: "Pakistan Rescue 1122", type: "Rescue", phone: "1122" },
	{ id: "la-4", name: "AKAH Disaster Response", type: "Disaster Relief", phone: "+925811920041" },
];

export const MOCK_COST_COMPARISON: MockCostComparison = {
	destination: "Hunza Valley — 8 Days",
	duration: "8 Days / 7 Nights",
	groupSize: 2,
	rows: [
		{ item: "Transport (Islamabad–Hunza)", soloCost: 14000, agencyCost: 0 },
		{ item: "Accommodation (per night)", soloCost: 8000, agencyCost: 0 },
		{ item: "Daily Meals (×8)", soloCost: 4000, agencyCost: 0 },
		{ item: "Local Guides", soloCost: 12000, agencyCost: 0 },
		{ item: "Permits & Entry Fees", soloCost: 5000, agencyCost: 0 },
		{ item: "Agency Package (all-in)", soloCost: 0, agencyCost: 189000 },
	],
};

export const SWIPE_TRAVELERS: SwipeTraveler[] = [
	{
		id: "st-1",
		name: "Amina Al-Farsi",
		age: 29,
		city: "Muscat, Oman",
		photo: "https://picsum.photos/seed/amina/600/800",
		bio: "Chasing the architectural soul of the Silk Road — from caravanserais to carved minarets. I document what most tourists walk past.",
		compatibility: 94,
		travelStyle: ["Heritage", "Photography", "Slow Travel"],
		traits: { Adventure: 62, Culture: 96, Budget: 55, Social: 70 },
		pastDestinations: ["Samarkand", "Isfahan", "Bukhara", "Petra"],
		mutualMatch: true,
		verified: true,
	},
	{
		id: "st-2",
		name: "Zain Malik",
		age: 32,
		city: "Lahore, Pakistan",
		photo: "https://picsum.photos/seed/zainm/600/800",
		bio: "Mountain silence and glacier routes are my reset button. Prefer slow treks over peak-bagging. Always has the best chai spot intel.",
		compatibility: 88,
		travelStyle: ["Mountain Seeker", "Tea Trails", "Minimalist"],
		traits: { Adventure: 85, Culture: 72, Budget: 80, Social: 45 },
		pastDestinations: ["Hunza", "Skardu", "Fairy Meadows", "Naran"],
		mutualMatch: false,
	},
	{
		id: "st-3",
		name: "Maha Noor",
		age: 27,
		city: "Gilgit, Pakistan",
		photo: "https://picsum.photos/seed/mahanoor/600/800",
		bio: "Itinerary builder who structures routes around food markets, heritage lanes, and the stories locals actually want to share.",
		compatibility: 91,
		travelStyle: ["Food Explorer", "Route Sync", "Cultural Dive"],
		traits: { Adventure: 68, Culture: 90, Budget: 60, Social: 88 },
		pastDestinations: ["Lahore Old City", "Skardu Bazaar", "Quetta", "Chitral"],
		mutualMatch: true,
		verified: true,
	},
	{
		id: "st-4",
		name: "Rayan Khalid",
		age: 34,
		city: "Karachi, Pakistan",
		photo: "https://picsum.photos/seed/rayank/600/800",
		bio: "Desert routes, stargazing camps, and camel caravan evenings. The Thar Belt and Balochistan coast are my laboratories.",
		compatibility: 79,
		travelStyle: ["Desert Nomad", "Night Sky", "Off-Grid"],
		traits: { Adventure: 92, Culture: 58, Budget: 70, Social: 52 },
		pastDestinations: ["Thar Desert", "Makran Coast", "Hingol", "Kund Malir"],
		mutualMatch: false,
	},
	{
		id: "st-5",
		name: "Sana Hussain",
		age: 26,
		city: "Islamabad, Pakistan",
		photo: "https://picsum.photos/seed/sanahussain/600/800",
		bio: "Wellness-first traveler who builds routes around thermal springs, forest stays, and high-altitude mornings. Always packs a journal.",
		compatibility: 83,
		travelStyle: ["Wellness", "Forest Bathing", "Journal"],
		traits: { Adventure: 55, Culture: 78, Budget: 65, Social: 72 },
		pastDestinations: ["Swat Valley", "Kaghan", "Shogran", "Ratti Gali"],
		mutualMatch: false,
	},
	{
		id: "st-6",
		name: "Tariq Bashir",
		age: 31,
		city: "Peshawar, Pakistan",
		photo: "https://picsum.photos/seed/tariqb/600/800",
		bio: "Oral history collector. I record folk songs at chai stalls and photograph bazaar craftsmen nobody else notices.",
		compatibility: 87,
		travelStyle: ["Heritage", "Documentary", "Local Connect"],
		traits: { Adventure: 48, Culture: 98, Budget: 75, Social: 82 },
		pastDestinations: ["Khyber Pass", "Mohenjo-daro", "Takht-i-Bahi", "Lahore Fort"],
		mutualMatch: true,
		verified: true,
	},
	{
		id: "st-7",
		name: "Leila Ahmadi",
		age: 28,
		city: "Kabul, Afghanistan",
		photo: "https://picsum.photos/seed/leilaa/600/800",
		bio: "Textile trail researcher — following ancient weaving routes from Central Asia into the subcontinent. Every carpet tells a migration story.",
		compatibility: 76,
		travelStyle: ["Research", "Textiles", "Slow Overland"],
		traits: { Adventure: 60, Culture: 95, Budget: 55, Social: 60 },
		pastDestinations: ["Mazar-i-Sharif", "Herat", "Samarkand", "Dushanbe"],
		mutualMatch: false,
	},
	{
		id: "st-8",
		name: "Omar Faris",
		age: 30,
		city: "Dubai, UAE",
		photo: "https://picsum.photos/seed/omarfaris/600/800",
		bio: "Luxury lodge scout who specializes in unearthing boutique mountain properties before they blow up. Always shares the finds.",
		compatibility: 72,
		travelStyle: ["Boutique Stays", "Fine Dining", "Curated Routes"],
		traits: { Adventure: 58, Culture: 70, Budget: 30, Social: 80 },
		pastDestinations: ["Eagle Nest Hunza", "Amanjiwo", "Singita", "Six Senses"],
		mutualMatch: false,
	},
];

export const MOCK_AGENCY_DETAIL: MockAgencyDetail = {
	id: "atlas-nomad-co",
	name: "Atlas Nomad Co.",
	heroImage: "https://images.unsplash.com/photo-1609184807049-a8b2e6acda0f?auto=format&fit=crop&w=1400&q=80",
	rating: 4.9,
	reviewCount: 268,
	philosophy:
		"We design expedition narratives that balance safety, altitude rhythm, and cultural depth so every route feels intentional and deeply local.",
	specialization: "High Altitude Expeditions",
	certification: "IATA + Local Tourism Board",
	startingPrice: 185000,
	officeAddress: "Old Fort Road, Karimabad, Hunza, Gilgit-Baltistan",
	phone: "+925811920222",
	email: "info@atlasnomad.pk",
	itineraries: [
		{
			id: "it-1",
			title: "Hunza Heritage Traverse",
			image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80",
			price: 189000,
			date: "12 Aug 2026",
			duration: 8,
			tags: ["Culture", "Scenic", "Moderate"],
		},
		{
			id: "it-2",
			title: "K2 Base Orientation Route",
			image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80",
			price: 265000,
			date: "03 Sep 2026",
			duration: 12,
			tags: ["Adventure", "Altitude", "Guided"],
		},
	],
};

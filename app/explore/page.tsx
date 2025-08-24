'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Star, Heart, Filter, X, Calendar, Users, Award, Mountain, TreePine, Building2 } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import { useSaved } from '@/components/SavedContext'
import { useRouter } from 'next/navigation'
import EnhancedBookingModal from '@/components/EnhancedBookingModal'
import Toast from '@/components/Toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrendingTags from '@/components/TrendingTags'
import AdvancedSearch from '@/components/AdvancedSearch'
import { useDataBus } from '@/components/DataBus'

interface ListingItem {
	_id: string
	title: string
  description: string
  location: {
    village: string
    state: string
    coordinates: number[]
  }
  price: number
  rating: number
  images: string[]
  amenities: string[]
  host: {
    name: string
    avatar: string
    rating: number
    totalHostings: number
  }
  highlights: string[]
  gettingThere: string
  bestTime: string
  activities: string[]
  experienceDetails: string
  accommodation: string
  localCuisine: string
  culturalHighlights: string
  adventureOptions: string
  seasonalAttractions: string
}

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedState, setSelectedState] = useState('')
	const [selectedExperience, setSelectedExperience] = useState('All')
	const [priceRange, setPriceRange] = useState('')
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
	const [sort, setSort] = useState('rating')
	const [showFilters, setShowFilters] = useState(false)

	const [listings, setListings] = useState<ListingItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [visible, setVisible] = useState(9)
	const { user } = useAuth()
	const { savedListings, toggleListing, isListingSaved } = useSaved()
	const [showPaymentModal, setShowPaymentModal] = useState(false)
	const [selectedVillage, setSelectedVillage] = useState<ListingItem | null>(null)
	const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)

	// Check if a village is already booked by the current user
	const isVillageBooked = (villageId: string) => {
		if (!user) return false
		// For now, return false since we don't have real booking data
		// This will be updated when we implement real booking tracking
		return false
	}

	const handleBookNow = (village: ListingItem) => {
		if (!user) {
			setToast({ message: 'Please sign in to book a village', type: 'error' })
			return
		}
		setSelectedVillage(village)
		setShowPaymentModal(true)
	}

	const handlePaymentSuccess = (paymentId: string, method: string) => {
		setToast({ 
			message: `Payment successful via ${method}! Your booking is confirmed.`, 
			type: 'success' 
		})
		setShowPaymentModal(false)
		// Refresh the page to show updated booking status
		window.location.reload()
	}

	const handleBookingSuccess = () => {
		setToast({ message: 'Booking successful! Your trip is confirmed.', type: 'success' })
		setShowPaymentModal(false)
		// Refresh the page or update the UI
		window.dispatchEvent(new Event('dashboardRefresh'))
	}

	const amenityOptions = ['WiFi', 'Meals', 'Parking', 'Local Guide', 'Hot Water', 'Kitchen']

	useEffect(() => {
		const fetchListings = async () => {
			setLoading(true)
			try {
				// Get mock listings from localStorage (created by host page)
				const mockListings = JSON.parse(localStorage.getItem('mockListings') || '[]')
				
				// Combine sample listings with mock listings
				const allListings = [...sampleListings, ...mockListings]
				setListings(allListings)
			} catch (error) {
				console.error('Error fetching listings:', error)
				setError('Failed to load listings')
				// Use sample data as fallback
				setListings(sampleListings)
			} finally {
				setLoading(false)
			}
		}

		fetchListings()
	}, []) // Empty dependency array to run only once

	const filtered = useMemo(() => {
		const arr = listings.filter((item) => {
			const q = searchQuery.trim().toLowerCase()
			const matchesQuery = !q ||
				item.title?.toLowerCase().includes(q) ||
				item.description?.toLowerCase().includes(q) ||
				item.location?.village?.toLowerCase().includes(q) ||
				item.location?.state?.toLowerCase().includes(q)

			const matchesState = !selectedState || item.location?.state === selectedState
			const matchesExperience = selectedExperience === 'All' || getExperienceType(item) === selectedExperience

			const price = item.price ?? 0
			let matchesPrice = true
			if (priceRange) {
				if (priceRange === '0-1000') matchesPrice = price <= 1000
				else if (priceRange === '1000-2000') matchesPrice = price >= 1000 && price <= 2000
				else if (priceRange === '2000-5000') matchesPrice = price >= 2000 && price <= 5000
				else if (priceRange === '5000+') matchesPrice = price >= 5000
			}

			const hasAmenities = selectedAmenities.length === 0 || selectedAmenities.every((a) => item.amenities?.includes(a))

			return matchesQuery && matchesState && matchesExperience && matchesPrice && hasAmenities
		})
		const sorted = arr.sort((a, b) => {
			if (sort === 'price_asc') return (a.price||0) - (b.price||0)
			if (sort === 'price_desc') return (b.price||0) - (a.price||0)
			return (b.rating||0) - (a.rating||0)
		})
		return sorted
	}, [listings, searchQuery, selectedState, selectedExperience, priceRange, selectedAmenities, sort]);

  const sampleListings: ListingItem[] = [
    {
      _id: 'manali-valley',
      title: 'Serene Mountain Retreat - Manali',
      description: 'Nestled in the majestic Himalayas, this traditional village offers breathtaking views of snow-capped peaks and pristine valleys. Experience authentic mountain culture and warm hospitality.',
      location: { 
        village: 'Manali Valley', 
        state: 'Himachal Pradesh',
        coordinates: [32.2432, 77.1892]
      },
      price: 2500,
      rating: 4.8,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
      ],
      amenities: ['Mountain View', 'Traditional Food', 'Local Guide', 'Adventure Activities'],
      host: {
        name: 'Rajesh Thakur',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.9,
        totalHostings: 45
      },
      highlights: ['Himalayan Trekking', 'Local Cuisine', 'Cultural Festivals', 'Adventure Sports'],
      gettingThere: 'Fly to Kullu Airport (KUU) or take a bus from Delhi. The village is 2 hours from Manali town.',
      bestTime: 'March to June and September to November',
      activities: ['Mountain Trekking', 'Local Market Visit', 'Traditional Cooking Classes', 'Village Walks'],
      experienceDetails: 'Immerse yourself in the authentic mountain lifestyle. Learn traditional cooking methods, participate in local festivals, and explore hidden trails with experienced guides.',
      accommodation: 'Traditional wooden cottages with modern amenities, offering panoramic mountain views.',
      localCuisine: 'Authentic Himachali dishes including Dham, Siddu, and local trout preparations.',
      culturalHighlights: 'Experience traditional folk dances, music performances, and local handicraft workshops.',
      adventureOptions: 'Guided treks to nearby peaks, river rafting, and mountain biking adventures.',
      seasonalAttractions: 'Spring brings blooming rhododendrons, summer offers pleasant weather, autumn showcases golden landscapes, and winter provides snow activities.'
    },
    {
      _id: 'gokarna-beach',
      title: 'Coastal Paradise Village - Gokarna',
      description: 'Discover the untouched beauty of coastal India where pristine beaches meet traditional fishing communities. Experience the rhythm of ocean life and authentic coastal culture.',
      location: { 
        village: 'Gokarna Beach', 
        state: 'Karnataka',
        coordinates: [14.5500, 74.3167]
      },
      price: 1800,
      rating: 4.6,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
      ],
      amenities: ['Beach Access', 'Fresh Seafood', 'Boat Tours', 'Sunset Views'],
      host: {
        name: 'Priya Menon',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
        rating: 4.7,
        totalHostings: 32
      },
      highlights: ['Pristine Beaches', 'Fresh Seafood', 'Traditional Fishing', 'Sunset Views'],
      gettingThere: 'Fly to Goa Airport (GOI) or take a train to Gokarna Road. The village is 30 minutes from the station.',
      bestTime: 'October to March',
      activities: ['Beach Walks', 'Fishing Tours', 'Seafood Cooking', 'Sunset Cruises'],
      experienceDetails: 'Live like a local fisherman in this coastal paradise. Learn traditional fishing techniques, enjoy fresh seafood, and experience the peaceful rhythm of coastal life.',
      accommodation: 'Traditional beach huts and modern cottages with ocean views and sea breeze.',
      localCuisine: 'Fresh seafood including prawns, fish curry, and traditional coastal delicacies.',
      culturalHighlights: 'Traditional fishing demonstrations, local temple visits, and cultural performances.',
      adventureOptions: 'Boat tours, snorkeling, and guided beach exploration.',
      seasonalAttractions: 'Monsoon brings lush greenery, post-monsoon offers clear skies, and winter provides pleasant weather for beach activities.'
    },
    {
      _id: 'jaisalmer-desert',
      title: 'Golden Desert Village - Jaisalmer',
      description: 'Experience the magic of the Thar Desert in this traditional Rajasthani village. Stay in authentic mud houses and experience the rich culture of the desert people.',
      location: { 
        village: 'Jaisalmer Desert', 
        state: 'Rajasthan',
        coordinates: [26.9157, 70.9083]
      },
      price: 2200,
      rating: 4.7,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
      ],
      amenities: ['Desert Views', 'Traditional Food', 'Camel Rides', 'Cultural Shows'],
      host: {
        name: 'Lakshmi Singh',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.8,
        totalHostings: 28
      },
      highlights: ['Desert Landscape', 'Traditional Architecture', 'Cultural Heritage', 'Camel Safaris'],
      gettingThere: 'Fly to Jaisalmer Airport (JSA) or take a train to Jaisalmer Junction. The village is 45 minutes from the city.',
      bestTime: 'October to March',
      activities: ['Desert Safaris', 'Cultural Performances', 'Traditional Cooking', 'Village Tours'],
      experienceDetails: 'Experience the authentic desert lifestyle in traditional mud houses. Learn about desert culture, enjoy folk music, and explore the golden sands on camelback.',
      accommodation: 'Traditional mud houses with modern comforts, offering stunning desert views.',
      localCuisine: 'Authentic Rajasthani dishes including Dal Baati Churma, Gatte ki Sabzi, and traditional sweets.',
      culturalHighlights: 'Folk music performances, traditional dance shows, and local handicraft demonstrations.',
      adventureOptions: 'Camel safaris, desert camping, and cultural village tours.',
      seasonalAttractions: 'Winter offers pleasant weather, spring brings desert blooms, and monsoon transforms the landscape with greenery.'
    },
    {
      _id: 'darjeeling-hills',
      title: 'Tea Estate Village - Darjeeling',
      description: 'Immerse yourself in the world of tea in this picturesque hill station. Stay in traditional tea estate bungalows and learn about tea cultivation from local experts.',
      location: { 
        village: 'Darjeeling Hills', 
        state: 'West Bengal',
        coordinates: [27.0360, 88.2626]
      },
      price: 3000,
      rating: 4.9,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      amenities: ['Tea Estate Views', 'Tea Tasting', 'Mountain Trekking', 'Local Guide'],
      host: {
        name: 'Amit Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.9,
        totalHostings: 56
      },
      highlights: ['Tea Plantations', 'Mountain Views', 'Local Culture', 'Adventure Activities'],
      gettingThere: 'Fly to Bagdogra Airport (IXB) or take a train to New Jalpaiguri. The village is 3 hours from the airport.',
      bestTime: 'March to May and September to November',
      activities: ['Tea Tasting Tours', 'Mountain Trekking', 'Local Market Visit', 'Cultural Shows'],
      experienceDetails: 'Live in the heart of tea country and learn the art of tea cultivation. Experience the traditional tea-making process and enjoy panoramic mountain views.',
      accommodation: 'Heritage tea estate bungalows with modern amenities and stunning plantation views.',
      localCuisine: 'Traditional Darjeeling tea, local Nepali dishes, and fresh organic produce from the estate.',
      culturalHighlights: 'Tea cultivation workshops, local market visits, and cultural performances.',
      adventureOptions: 'Mountain trekking, tea garden walks, and local village exploration.',
      seasonalAttractions: 'Spring brings tea garden blooms, summer offers pleasant weather, autumn showcases golden landscapes, and winter provides clear mountain views.'
    },
    {
      _id: 'alleppey-backwaters',
      title: 'Backwaters Village - Alleppey',
      description: 'Experience the serene beauty of Kerala\'s backwaters in this traditional village. Stay in houseboats and experience the unique lifestyle of the backwater communities.',
      location: { 
        village: 'Alleppey Backwaters', 
        state: 'Kerala',
        coordinates: [9.4981, 76.3388]
      },
      price: 2800,
      rating: 4.8,
      images: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
      ],
      amenities: ['Backwater Views', 'Houseboat Stay', 'Local Cuisine', 'Boat Tours'],
      host: {
        name: 'Maria Fernandes',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
        rating: 4.8,
        totalHostings: 41
      },
      highlights: ['Backwater Views', 'Traditional Houseboats', 'Local Cuisine', 'Cultural Heritage'],
      gettingThere: 'Fly to Cochin Airport (COK) or take a train to Alleppey. The village is 1 hour from the station.',
      bestTime: 'June to March',
      activities: ['Houseboat Cruises', 'Local Cooking Classes', 'Village Walks', 'Cultural Performances'],
      experienceDetails: 'Float through the serene backwaters in traditional houseboats. Experience the unique lifestyle of backwater communities and learn about local traditions.',
      accommodation: 'Traditional houseboats with modern comforts, offering stunning backwater views.',
      localCuisine: 'Fresh seafood, traditional Kerala dishes, and local spices and flavors.',
      culturalHighlights: 'Traditional boat races, local temple visits, and cultural performances.',
      adventureOptions: 'Houseboat cruises, fishing tours, and village exploration.',
      seasonalAttractions: 'Monsoon brings lush greenery, post-monsoon offers clear skies, and winter provides pleasant weather for backwater activities.'
    },
    {
      _id: 'bastar-tribal',
      title: 'Tribal Village - Bastar',
      description: 'Discover the rich tribal culture of Chhattisgarh in this authentic village. Experience traditional tribal life, customs, and handicrafts in their natural setting.',
      location: { 
        village: 'Bastar Region', 
        state: 'Chhattisgarh',
        coordinates: [19.1071, 81.9535]
      },
      price: 1500,
      rating: 4.5,
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      ],
      amenities: ['Tribal Culture', 'Traditional Food', 'Local Guide', 'Handicraft Workshops'],
      host: {
        name: 'Rajesh Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 4.6,
        totalHostings: 23
      },
      highlights: ['Tribal Culture', 'Traditional Handicrafts', 'Local Festivals', 'Natural Beauty'],
      gettingThere: 'Fly to Raipur Airport (RPR) or take a train to Jagdalpur. The village is 2 hours from the city.',
      bestTime: 'October to March',
      activities: ['Tribal Dance Shows', 'Handicraft Workshops', 'Village Tours', 'Cultural Festivals'],
      experienceDetails: 'Immerse yourself in authentic tribal culture and traditions. Learn about local customs, participate in traditional festivals, and explore tribal handicrafts.',
      accommodation: 'Traditional tribal huts with modern amenities, offering authentic cultural experience.',
      localCuisine: 'Traditional tribal dishes, local forest produce, and authentic tribal cooking methods.',
      culturalHighlights: 'Traditional dance performances, handicraft workshops, and local festival participation.',
      adventureOptions: 'Village tours, forest walks, and cultural immersion activities.',
      seasonalAttractions: 'Winter offers pleasant weather, spring brings tribal festivals, and monsoon showcases lush forest landscapes.'
    }
  ]

		const experienceTypes = ['All', 'Mountain', 'Beach', 'Desert', 'Tea Estate', 'Backwaters', 'Tribal']
		
		const getExperienceType = (item: ListingItem) => {
			if (!item.highlights || !Array.isArray(item.highlights)) return 'Mountain'
			if (item.highlights.some(h => h.includes('Mountain') || h.includes('Himalayan'))) return 'Mountain'
			if (item.highlights.some(h => h.includes('Beach') || h.includes('Coastal'))) return 'Beach'
			if (item.highlights.some(h => h.includes('Desert'))) return 'Desert'
			if (item.highlights.some(h => h.includes('Tea'))) return 'Tea Estate'
			if (item.highlights.some(h => h.includes('Backwater'))) return 'Backwaters'
			if (item.highlights.some(h => h.includes('Tribal'))) return 'Tribal'
			return 'Mountain' // Default fallback
		}

	return (
		<div className="min-h-screen">
			<Header />
			<section className="hero-modern">
				<div className="container-custom text-center">
					<h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Explore Authentic Village Experiences</h1>
					<p className="text-earth-600 mb-8 max-w-3xl mx-auto">Discover real India through direct connections with rural communities.</p>
					<AdvancedSearch
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						selectedState={selectedState}
						setSelectedState={setSelectedState}
						selectedExperience={selectedExperience}
						setSelectedExperience={setSelectedExperience}
						priceRange={priceRange}
						setPriceRange={setPriceRange}
						selectedAmenities={selectedAmenities}
						setSelectedAmenities={setSelectedAmenities}
					/>
				</div>
			</section>
			<TrendingTags />
			<section className="section-padding bg-white">
				<div className="container-custom">
					<div className="flex items-center justify-between mb-4">
						<div className="text-sm text-earth-600">{filtered.length} results</div>
						<div className="flex items-center gap-4">
							<label className="flex items-center gap-2 text-sm text-earth-600">
								<input type="checkbox" className="rounded" />
								Show Map Preview
							</label>
							<label className="text-sm text-earth-600">Sort by</label>
							<select value={sort} onChange={(e) => setSort(e.target.value as any)} className="input py-1 pr-8">
								<option value="rating_desc">Top rated</option>
								<option value="price_asc">Price: Low to High</option>
								<option value="price_desc">Price: High to Low</option>
							</select>
						</div>
					</div>

					{/* Amenity quick filters */}
					<div className="mb-6 flex flex-wrap gap-2">
						{amenityOptions.map(opt => (
							<button
								key={opt}
								onClick={() => setSelectedAmenities(prev => prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt])}
								className={`px-3 py-1 rounded-lg text-sm ${selectedAmenities.includes(opt) ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}
							>
								{opt}
							</button>
						))}
						{selectedAmenities.length > 0 && (
							<button className="px-3 py-1 rounded-lg text-sm bg-earth-200 text-earth-700" onClick={() => setSelectedAmenities([])}>Clear</button>
						)}
					</div>
					{loading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
						</div>
					) : (
						<>
							{error && <p className="text-center text-sunset-700 mb-4">{error}</p>}
							{filtered.length === 0 ? (
								<p className="text-center text-earth-600">No results found. Try adjusting filters.</p>
							) : (
								<>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
										{filtered.slice(0, visible).map((item) => (
											<div key={item._id} className="card overflow-hidden hover:shadow-lg transition-shadow">
												<div className="relative">
													<Link href={`/explore/${item._id}`}>
														<Image
															src={item.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'}
															alt={item.title}
															width={400}
															height={192}
															className="w-full h-48 object-cover"
															style={{ width: 'auto', height: 'auto' }}
														/>
													</Link>
													{getExperienceType(item) && (
														<div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
															{getExperienceType(item)}
														</div>
													)}
													<div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-earth-800">
														₹{item.price ?? 0}/night
													</div>
												</div>
												<div className="p-6">
													<Link href={`/explore/${item._id}`} className="text-lg font-semibold text-earth-800 mb-1 block hover:underline">
														{item.title}
													</Link>
													<div className="flex items-center text-sm text-earth-600 mb-2">
														<MapPin className="w-4 h-4 mr-1" />
														{item.location?.village || 'Unknown'}, {item.location?.state || 'Unknown'}
													</div>
													{/* Location coordinates display */}
													{Array.isArray(item.location?.coordinates) && item.location?.coordinates?.length === 2 && (
														<div className="mt-2 p-2 bg-earth-50 rounded-lg border border-earth-200">
															<div className="flex items-center text-xs text-earth-500">
																<MapPin className="w-3 h-3 mr-1" />
																<span>
																	Coordinates: ({item.location.coordinates[0].toFixed(4)}, {item.location.coordinates[1].toFixed(4)})
																</span>
															</div>
														</div>
													)}
													<div className="flex items-center justify-between mt-3">
														<div className="flex items-center">
															<Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
															<span className="font-semibold">{item.rating ?? 0}</span>
															<span className="text-earth-600 text-sm ml-2">(0 reviews)</span>
														</div>
														<button
															type="button"
															onClick={() => {
																toggleListing(item._id)
																setToast({ message: savedListings.has(item._id) ? 'Removed from saved' : 'Saved to favorites', type: 'success' })
															}}
															className={`text-sm px-3 py-1 rounded-lg ${savedListings.has(item._id) ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}
														>
															{savedListings.has(item._id) ? 'Saved' : 'Save'}
														</button>
													</div>
													<div className="mt-4 flex gap-2">
														<Link href={`/explore/${item._id}`} className="btn-secondary flex-1 text-center">View Details</Link>
														<button className="btn-primary flex-1" onClick={() => handleBookNow(item)}>
															{isVillageBooked(item._id) ? 'Booked' : 'Book Now'}
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
									{visible < filtered.length && (
										<div className="text-center mt-8">
											<button className="btn-secondary" onClick={() => setVisible(v => v + 9)}>Load more</button>
										</div>
									)}
								</>
							)}
						</>
					)}
				</div>
			</section>
			<Footer />
			
			{toast && (
				<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
			)}

			{showPaymentModal && selectedVillage && (
				<EnhancedBookingModal
					isOpen={showPaymentModal}
					onClose={() => setShowPaymentModal(false)}
					village={selectedVillage}
					onBookingSuccess={handleBookingSuccess}
				/>
			)}
		</div>
	)
}

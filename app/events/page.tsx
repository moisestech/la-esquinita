"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

// Placeholder events data
const events = [
  {
    id: "1",
    title: "Black Friday Rave",
    description: "A night of Miami kitsch and electronic beats in the heart of the swamp. Experience the intersection of art, music, and Miami culture.",
    date: "December 28, 2024",
    time: "9:00 PM - 2:00 AM",
    location: "La Esquinita Backstage",
    type: "rave",
    capacity: 150,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    title: "Meet the Artist: Tara Long",
    description: "An intimate evening with the creator of La Esquinita. Learn about the inspiration behind Miami kitsch and the art of convenience store curation.",
    date: "January 5, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "La Esquinita Gallery",
    type: "talk",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    title: "Speakeasy Opening",
    description: "The grand opening of our hidden speakeasy experience. Enter through the secret door and discover Miami's most artistic convenience store.",
    date: "January 12, 2025",
    time: "8:00 PM - 11:00 PM",
    location: "La Esquinita Speakeasy",
    type: "opening",
    capacity: 75,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    title: "Kitsch & Koffee Workshop",
    description: "Learn the art of Miami kitsch in this hands-on workshop. Create your own kitsch masterpiece while sipping on locally roasted coffee.",
    date: "January 19, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "La Esquinita Workshop Space",
    type: "workshop",
    capacity: 30,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
  }
]

export default function Events() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-rot via-stucco to-icing-white">
      {/* Header */}
      <motion.div
        className="text-center py-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-skeleton text-miami-pink mb-4 drop-shadow-neon-pink">
          Events
        </h1>
        <p className="text-xl md:text-2xl text-mint-rot font-display max-w-2xl mx-auto">
          Join us for exclusive events, workshops, and performances that celebrate Miami's artistic community
        </p>
      </motion.div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-sugar-pink hover:border-miami-pink transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Event Image */}
              <div className="h-48 bg-gradient-to-br from-miami-pink to-miami-purple relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-miami-pink text-white px-3 py-1 rounded-full text-sm font-bold uppercase">
                  {event.type}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-skeleton text-mint-rot mb-2">
                  {event.title}
                </h3>
                <p className="text-mint-rot/70 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-mint-rot/80">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-mint-rot/80">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-mint-rot/80">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-mint-rot/80">
                    <Users className="w-4 h-4 mr-2" />
                    Capacity: {event.capacity}
                  </div>
                </div>

                {/* RSVP Button */}
                <motion.button 
                  className="w-full bg-gradient-to-r from-miami-pink to-miami-purple text-white py-3 rounded-lg font-bold transition-all duration-300 relative overflow-hidden group"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(255, 105, 180, 0.6), 0 0 60px rgba(78, 205, 196, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('https://partiful.com', '_blank')}
                >
                  <span className="relative z-10">RSVP Now</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-miami-pink via-miami-purple to-miami-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 
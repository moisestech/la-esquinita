"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

// Events data from the scrolling banner
const events = [
  {
    id: "1",
    title: "Opening Reception",
    description: "Join us for the grand opening of La Esquinita at Locust Projects. Experience the intersection of art, convenience, and Miami culture in this unique installation.",
    date: "November 19, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Locust Projects, Miami",
    type: "reception",
    capacity: 100,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    title: "Black Friday Rave",
    description: "A night of Miami revelry and electronic beats. Experience the intersection of art, music, and Miami culture in this unique after-hours event.",
    date: "November 28, 2024",
    time: "9:00 PM - 2:00 AM",
    location: "La Esquinita at Locust Projects",
    type: "rave",
    capacity: 150,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    title: "Miami Art Week Press Preview",
    description: "Exclusive press preview during Miami Art Week. Get a first look at the latest ceramic works and installations before the public opening.",
    date: "December 2, 2024",
    time: "10:00 AM - 12:00 PM",
    location: "La Esquinita at Locust Projects",
    type: "preview",
    capacity: 50,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    title: "Meet the Artist VIP Basel Reception",
    description: "An intimate VIP reception during Art Basel Miami Beach. Meet artist Tara Long and discover the stories behind the ceramic works.",
    date: "December 6, 2024",
    time: "7:00 PM - 10:00 PM",
    location: "La Esquinita at Locust Projects",
    type: "reception",
    capacity: 75,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop"
  },
  {
    id: "5",
    title: "Closing Reception",
    description: "Join us for the closing celebration of La Esquinita. A final opportunity to experience this unique art installation and celebrate the community that formed around it.",
    date: "January 17, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "La Esquinita at Locust Projects",
    type: "reception",
    capacity: 100,
    image: "/esquinita3.jpg"
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
        <h1 className="text-6xl md:text-8xl font-skeleton text-white mb-4 drop-shadow-neon-pink">
          Events
        </h1>
        <p className="text-xl md:text-2xl text-mint-rot font-display max-w-2xl mx-auto">

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
                <h3 className="text-xl font-bold text-mint-rot mb-2">
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
                  className="w-full bg-gray-500 text-white py-3 rounded-lg font-bold transition-all duration-300 relative overflow-hidden cursor-not-allowed opacity-75"
                  disabled
                >
                  <span className="relative z-10">RSVP Opening Soon</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 
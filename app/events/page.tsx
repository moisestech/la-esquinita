"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Clock } from "lucide-react"

// Events data from the scrolling banner
const events = [
  {
    id: "1",
    title: "Delight & Devour Annual Benefit Dinner",
    description: "Indulge in a decadent feast for the senses under the imagination of Miami multi-disciplinary artist Tara Long. Expect the unexpected. Savor the spectacle. Share the table and gather for an experience of connection, creation, and a little bit of magic.",
    date: "November 14, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Locust Projects, Miami",
    type: "dinner",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    rsvpUrl: "https://www.locustprojects.org/pages/delight-devour-2025-benefit-dinner.html",
    isPast: true,
    statusText: "SOLD OUT!"
  },
  {
    id: "2",
    title: "Opening Reception",
    description: "Join us for the grand opening of La Esquinita at Locust Projects.",
    date: "November 21, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Locust Projects, Miami",
    type: "reception",
    image: "/mosquitobar.jpg",
    rsvpUrl: "https://partiful.com/e/9ojzbO78cQiUitnzaRyb",
    isPast: true,
    statusText: "AT CAPACITY!"
  },
  {
    id: "3",
    title: "Miami Art Week Press Preview",
    description: "Exclusive press preview during Miami Art Week. Get a first look at the latest ceramic works and installations before the public opening.",
    date: "December 2, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "La Esquinita at Locust Projects",
    type: "preview",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    isPast: true,
    statusText: "EVENT PASSED"
  },
  {
    id: "4",
    title: "Meet the Artist VIP Basel Reception",
    description: "An intimate VIP reception during Art Basel Miami Beach. Meet artist Tara Long and discover the stories behind La Esquinita.",
    date: "December 6, 2025",
    time: "7:00 PM - 10:00 PM",
    location: "La Esquinita at Locust Projects",
    type: "reception",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=600&fit=crop"
  },
  {
    id: "5",
    title: "Annual Holiday Makers Mart",
    description: "Annual Holiday Makers Mart + Little River Art Days. A festive marketplace featuring local artists and makers. Free and open to all!",
    date: "December 13, 2025",
    time: "12:00 PM - 5:00 PM",
    location: "Locust Projects, Miami",
    type: "market",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=600&fit=crop"
  },
  {
    id: "6",
    title: "Closing Reception",
    description: "Join us for the closing celebration of La Esquinita.",
    date: "January 17, 2026",
    time: "6:00 PM - 9:00 PM",
    location: "La Esquinita at Locust Projects",
    type: "reception",
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
              className={`rounded-2xl shadow-lg overflow-hidden border-2 transition-colors duration-300 ${
                event.isPast
                  ? 'bg-white border-gray-300 opacity-80'
                  : 'bg-white border-sugar-pink hover:border-miami-pink'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: event.isPast ? 0.8 : 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Event Image */}
              <div className="h-48 bg-gradient-to-br from-miami-pink to-miami-purple relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className={`w-full h-full object-cover ${event.isPast ? 'opacity-50' : ''}`}
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold uppercase ${
                  event.isPast ? 'bg-gray-400 text-white' : 'bg-miami-pink text-white'
                }`}>
                  {event.type}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${event.isPast ? 'text-mint-rot/50' : 'text-mint-rot'}`}>
                  {event.title}
                </h3>
                <p className={`text-sm mb-4 line-clamp-3 ${event.isPast ? 'text-mint-rot/40' : 'text-mint-rot/70'}`}>
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className={`flex items-center text-sm ${event.isPast ? 'text-mint-rot/50' : 'text-mint-rot/80'}`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className={`flex items-center text-sm ${event.isPast ? 'text-mint-rot/50' : 'text-mint-rot/80'}`}>
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className={`flex items-center text-sm ${event.isPast ? 'text-mint-rot/50' : 'text-mint-rot/80'}`}>
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>

                {/* RSVP Button */}
                {event.isPast ? (
                  <motion.button
                    className="w-full bg-gray-400 text-white py-3 rounded-lg font-bold cursor-not-allowed"
                    disabled
                  >
                    <span className="relative z-10">{event.statusText || 'AT CAPACITY!'}</span>
                  </motion.button>
                ) : event.rsvpUrl ? (
                  <motion.a
                    href={event.rsvpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-miami-pink to-miami-purple text-white py-3 rounded-lg font-bold text-center transition-all duration-300 relative overflow-hidden hover:opacity-90"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">RSVP Now</span>
                  </motion.a>
                ) : (
                  <motion.button
                    className="w-full bg-gradient-to-r from-miami-pink to-miami-purple text-white py-3 rounded-lg font-bold transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10">OPEN TO THE PUBLIC</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Grant Acknowledgment */}
        <motion.div
          className="max-w-2xl mx-auto text-center mt-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-sm text-mint-rot/70">
            La Esquinita is commissioned by Locust Projects and supported in part with a grant from Funding Arts Network.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

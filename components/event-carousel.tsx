"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const events = [
  {
    title: "Gala Dinner",
    image: "https://order.euromedicom.com/img/galaDinner.jpg",
    time: "8:00 PM",
    venue: "Grand Ballroom"
  },
  {
    title: "Live Music Concert",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    time: "6:00 PM",
    venue: "Open Air Theatre"
  },
  {
    title: "Back to Benches",
    image: "https://www.jeppiaarinstitute.org/wp-content/uploads/2024/05/3P3A5646-scaled.jpg",
    time: "10:00 PM",
    venue: "Party Arena"
  },
  {
    title: "Starry Night",
    image: "https://media.istockphoto.com/id/1361463875/vector/winner-nomination-award-with-gold-laurel-luxury-reward-certificate-poster-with-glitter.jpg?s=612x612&w=0&k=20&c=BMy8GmBx3OFa5qp7qvD5za7w8dZdgq-xT7lWKvS_Vsw=",
    time: "4:00 PM",
    venue: "Main Auditorium"
  }
];

export default function EventCarousel() {
  return (
    <section className="py-20 px-4 bg-gradient-blue">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 text-gradient">Event Highlights</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          An unforgettable evening of entertainment and celebration
        </p>
      </motion.div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {events.map((event, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="mx-2 glass-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative group">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="font-semibold">{event.time}</p>
                          <p>{event.venue}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gradient">{event.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
           </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="glass-button -left-4 sm:-left-12" />
          <CarouselNext className="glass-button -right-4 sm:-right-12" />
        </div>
      </Carousel>
    </section>
  );
}
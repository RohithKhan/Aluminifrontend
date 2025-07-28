"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

const scheduleData = [
  {
    day: "March 1",
    events: [
      {
        title: "Starry Night of Excellence",
        description: "Honouring Legends, Inspiring Futures",
        explanation: "Celebrating achievements with the 8 Category Awards"
      },
      {
        title: "Rhythm of JIT - Live Music Concert",
        description: "Relive Memories, Rewind Melodies",
        explanation: "A soulful evening with live performance"
      },
      {
        title: "The Grand Gala Dinner - Feast & Fellowship",
        description: "Breaking Bread, Building Bonds",
        explanation: "A lavish dinner to reconnect and rejoice"
      },
      {
        title: "Back to Benches - Relive Classroom Memories",
        description: "Once a Student, Always a Student",
        explanation: "Recreate the classroom experience with a fun twist"
      },
      {
        title: "Open Mic - Alumni Unplugged",
        description: "A platform for alumni to share memories, jokes, or even talents",
      }
    ]
  }
];

export default function Schedule() {
  return (
    <section className="py-20 px-4 bg-gradient-blue">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 text-gradient">Event Schedule</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A night filled with entertainment, music, and celebration
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {scheduleData.map((day, dayIndex) => (
          <motion.div
            key={dayIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-center mb-8 text-gradient">{day.day}</h3>
            {day.events.map((event, eventIndex) => (
              <motion.div
                key={eventIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: eventIndex * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2 text-gradient">{event.title}</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      {event.description}
                    </p>
                    {/* <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="glass px-3 py-1 rounded-full flex items-center gap-1"> */}
                        
                        {/* <span>{event.time}</span> */}
                      {/* </div> */}
                      {/* <div className="glass px-3 py-1 rounded-full flex items-center gap-1"> */}
                        
                        {/* <span>{event.location}</span> */}
                      {/* </div> */}
                    {/* </div> */}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Hero() {
  const quotes = [
    "Where memories meet the future",
    "A night of entertainment and celebration",
    "Reuniting hearts, rekindling friendships",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0">
        <img
          src="https://drive.google.com/file/d/17RQH0QTkE2nmRKAi0xvtm8ZWiojxudLy/view?usp=sharing"
          alt="University Campus"
          className="object-cover w-full h-full opacity-5.5"
        />
      </div>

      <div className="relative z-10 text-center px-4 w-full max-w-[95%] xl:max-w-[85%] 2xl:max-w-[75%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 md:p-12 lg:p-16 rounded-2xl space-y-8"
        >
          <GraduationCap className="w-20 h-20 mx-auto text-primary mb-8 animate-float" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gradient">
            JIT Alumni Reunion Meet - 2025
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            {quotes.map((quote, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="text-lg md:text-xl lg:text-2xl text-muted-foreground"
              >
                {quote}
              </motion.p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12"
          >
            <div className="text-primary text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold glass px-6 py-3 rounded-full flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg :text-l">
                March 1, 2025 ( Saturday )
              </span>
            </div>

            <div className="hidden md:block w-2 h-2 rounded-full bg-primary" />
            <div className="text-primary text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold glass px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 text-muted-foreground">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span className="whitespace-nowrap">Jeppiaar Institute of Technology (Autonomous)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12"
          ><div className="hidden md:block w-2 h-2 rounded-full bg-primary" />
            <div className="text-primary text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold glass px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 text-muted-foreground">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              <span className="whitespace-nowrap"> 3.30 pm Onwards</span>
            </div></motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-12"
          >
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-center">
              <Link href="/register">
                <Button size="lg" className="text-primary glass-button text-lg px-10 py-7 rounded-full hover:scale-105 hover:text-white transition-transform">
                  Register Now
                </Button>
              </Link>
            </div> */}


          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: <Users className="w-10 h-10 mx-auto mb-4" />,
                number: "1000+",
                text: "Alumni Expected",
              },
              {
                icon: <Calendar className="w-10 h-10 mx-auto mb-4" />,
                number: "4",
                text: "Amazing Events",
              },
              {
                icon: <MapPin className="w-10 h-10 mx-auto mb-4" />,
                number: "1",
                text: "Night of Celebration",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.2 }}
                className="glass p-8 rounded-xl text-center hover:scale-105 transition-transform"
              >
                {stat.icon}
                <h3 className="text-5xl font-bold text-gradient mb-2">{stat.number}</h3>
                <p className="text-muted-foreground text-lg">{stat.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
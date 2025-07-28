"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Code, Heart, Mail } from 'lucide-react';

// Dynamically import components with ssr: false to prevent hydration mismatch
const Hero = dynamic(() => import('@/components/hero'), { ssr: false });
const EventCarousel = dynamic(() => import('@/components/event-carousel'), { ssr: false });
const Schedule = dynamic(() => import('@/components/schedule'), { ssr: false });

const aboutContent = {
  director: {
    name: "Dr. N. Marie Wilson B.Tech, MBA, Ph.D",
    title: "Managing Director",
    image: "https://pbs.twimg.com/media/C_ILmq_WAAACRqF.jpg"
  }
};

const executiveMembers = [
  {
    name: "Dr.J.Venu Gopala Krishnan, M.Tech., F.I.E., Ph.D",
    designation: "Principal",
    position: "Chair person"
  },
  {
    name: "Mr.C.Senthilkumar M.Sc.,M.Phil.,B.Ed.,SET.,(Ph.D)",
    designation: "Assistant Professor",
    position: "Coordinator"
  },
  {
    name: "Dr.W.Nancy M.E.,Ph.D",
    designation: "Assistant Professor",
    position: "Executive Member"
  },
  {
    name: "Mr.M.Kubendiran M.E",
    designation: "Assistant Professor",
    position: "Executive Member"
  },
  {
    name: "Ms.V.Shanmuga Priya M.E",
    designation: "Assistant Professor",
    position: "Executive Member"
  },
  {
    name: "Mr.S.Rajesh M.E",
    designation: "Assistant Professor",
    position: "Executive Member"
  },
  {
    name: "Mr.K.Jayaprakash M.E",
    designation: "Assistant Professor",
    position: "Executive Member"
  },
  {
    name: "Ms.C.Bakkialakshmi MBA",
    designation: "Assistant Professor",
    position: "Executive Member"
  }
];

const officeBearers = [
  {
    name: "Mr.SYED KALEEFATHULLA",
    batch: "2011-BATCH-EEE",
    position: "PRESIDENT",
    image: "https://www.jeppiaarinstitute.org/wp-content/uploads/2024/10/1-1.png",
    linkedin:"",
    email:""
  },
  {
    name: "Mr.E.STEPHEN ARPUTHARAJ",
    batch: "2021-BATCH-MBA",
    position: "VICE-PRESIDENT",
    image: "https://www.jeppiaarinstitute.org/wp-content/uploads/2024/10/2-1-292x300.png",
    linkedin:"",
    email:""
  },
  {
    name: "Ms.PRINCEY SELVA",
    batch: "2011-BATCH-IT",
    position: "SECRETARY",
    image: "https://www.jeppiaarinstitute.org/wp-content/uploads/2024/10/3-1.png",
    linkedin:"",
    email:""
  },
  {
    name: "Ms.BARKHAVI RATHINAVELU",
    batch: "2012-BATCH-ECE",
    position: "JOINT SECRETARY",
    image: "https://www.jeppiaarinstitute.org/wp-content/uploads/2024/10/4-1-274x300.png",
    linkedin:"",
    email:""
  },
  {
    name: "Mr.SHANKARA VIJAYENDRAN R",
    batch: "2011-BATCH-IT",
    position: "TREASURER",
    image: "https://www.jeppiaarinstitute.org/wp-content/uploads/2024/10/5.png",
    linkedin:"",
    email:""
  }
];

export default function Home() {
  useEffect(() => {
    // Store timeouts in a Set for proper cleanup
    const timeouts = new Set();


    // Cleanup function
    return () => {
      timeouts.forEach((timeout) => {
        if (typeof timeout === "number") {
          clearTimeout(timeout);
        }
      });
    };

  }, []);

  return (
    <main className="min-h-screen bg-gradient-blue">
      <Hero />
      <EventCarousel />
      <Schedule />

      {/* About Section */}
      <section className="py-20 px-4 bg-gradient-blue min-h-screen flex items-center justify-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Chief Patron</h2>
          <div className="grid place-items-center justify-center">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              </p>
            </div>
            <div className="space-y-6 sticky top-8">
              <div
                className="rounded-lg overflow-hidden shadow-lg bg-card-gradient  justify-center"
                style={{
                  height: '600px',
                  maxHeight: '80vh',
                }}
              >
                <div className="h-[85%] relative flex items-center justify-center">
                  <img
                    src={aboutContent.director.image}
                    alt="Managing Director"
                    className="object-contain w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="h-[15%] p-4 bg-card-gradient flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl font-semibold">{aboutContent.director.name}</h3>
                  <p className="text-muted-foreground">{aboutContent.director.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Members Section */}
      <section className="py-20 px-4 bg-gradient-blue">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Executive Members</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card-gradient rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gradient-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left">S.NO</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Designation</th>
                  <th className="px-6 py-4 text-left">Position</th>
                </tr>
              </thead>
              <tbody>
                {executiveMembers.map((member, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{member.name}</td>
                    <td className="px-6 py-4">{member.designation}</td>
                    <td className="px-6 py-4">{member.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Office Bearers Section */}
      <section className="py-20 px-4 bg-gradient-blue">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Office Bearers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {officeBearers.map((bearer, index) => (
              <div
                key={index}
                className="bg-card-gradient rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative w-full h-64 md:h-80 lg:h-96">
                  <img
                    src={bearer.image}
                    alt={bearer.name}
                    className="w-full h-full object-contain rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col justify-between bg-card-gradient min-h-40">
                  <div className="text-center space-y-3">
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{bearer.name}</h3>
                    <p className="text-muted-foreground text-sm">{bearer.batch}</p>
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full font-medium text-xs sm:text-sm">
                      {bearer.position}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-4 flex justify-center space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="w-5 h-5" />{bearer.linkedin}
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="w-5 h-5" />{bearer.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center bg-gradient-blue">
        <h2 className="text-4xl font-bold mb-6">Ready to Join Us?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Don't miss this opportunity to reconnect with your alma mater and fellow alumni.
          Register now to secure your spot at this memorable reunion!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6 bg-gradient-primary hover:opacity-90">
              Register Now
            </Button>
          </Link>
        </div> 
       </section> 

      {/* Social Media Links */}
      <footer className="bg-gradient-blue py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link
              href="https://www.facebook.com/JeppiaarInstitute"
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="w-6 h-6" />
              <span>Facebook</span>
            </Link>
            <Link
              href="https://twitter.com/JeppiaarIT"
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="w-6 h-6" />
              <span>Twitter</span>
            </Link>
            <Link
              href="https://www.instagram.com/jit_alumni?utm_source=qr&igsh=czVyMHkwYjF3Z3ln"
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-6 h-6" />
              <span>Instagram</span>
            </Link>
            <Link
              href="https://youtube.com/@jeppiaarinstituteoftechnology?si=GqUDeRzTe6GVaXEY"
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="w-6 h-6" />
              <span>YouTube</span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/jeppiaar-institute-of-technology/?trk=similar-pages_result-cardfull-"
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-6 h-6" />
              <span>LinkedIn</span>
            </Link>
          </div>

          <div className="text-center pt-8 border-t border-border">
            <p className="flex items-center justify-center gap-2 text-muted-foreground">
              <Code className="w-4 h-4" />
              <span>Developed by</span>
              <span className="font-semibold">Jit Alumni Association</span>
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Link
                href="https://www.instagram.com/jit_alumni?utm_source=qr&igsh=czVyMHkwYjF3Z3ln"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/syed-kaleefathulla"
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
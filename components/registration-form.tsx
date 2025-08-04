"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AxiosError } from "axios";
import axios from "axios";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { METHODS } from "http";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone:z.string().regex(/^[6789]\d{9}$/, "Invalid phone number format").transform((val) => Number(val)),
  courseType: z.enum(["UG", "PG"]),
  batch: z.string().min(2, "Please select your batch"),
  department: z.enum(["IT", "CSE", "ECE", "EEE", "MBA","MECH"]),
  gender: z.enum(["Male", "Female", "Other"]),
  transportlocation: z.string().optional(),
  familymembers:z.string().regex(/^\d+$/, "Must be a valid number").transform((val) => Number(val)),
  childrens: z.string().regex(/^\d+$/, "Must be a valid number").transform((val) => Number(val)),
  needstransport: z.boolean().optional(),
  participatingevent: z.boolean(),
  performancetype: z.enum(["Solo Dance", "Group Dance", "Solo Singing", "Group Singing", "Mime", "Skit", "Stand-up Comedy", "Instrumental Music Performance", "Magic Show", "Mimicry"]).optional(),
})
.refine(
  (data) => {
    if (data.participatingevent && !data.performancetype) {
      return false;
    }
    return true;
  },
  {
    message: "Please select a performance type",
    path: ["performancetype"],
  }
).refine(
  (data) => {
    if (data.needstransport && !data.transportlocation) {
      return false;
    }
    return true;
  },
  {
    message: "Please enter a transport location",
    path: ["transportlocation"],
  }
);

function RegistrationForm() {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: undefined,
      courseType: undefined,
      batch: "",
      department: undefined,
      gender: undefined,
      transportlocation: "",
      familymembers: undefined,
      childrens: undefined,
      needstransport: false,
      participatingevent: false,
      performancetype: undefined,
    },
  });

  const courseType = form.watch("courseType");
  const needstransport = form.watch("needstransport");
  const participatingevent = form.watch("participatingevent");

  const getBatchOptions = () => {
    if (courseType === "UG") {
      return [
        "2011-2015",
        "2012-2016",
        "2013-2017",
        "2015-2019",
        "2016-2020",
        "2017-2021",
        "2018-2022",
        "2019-2023",
        "2020-2024",
      ];
    }
    return ["2021-2023", "2022-2024"];
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonLoading(true);

    try {
      // const response = await fetch("http://localhost:8000/api/add",{
      
      // })
      const response = await axios.post(
        "https://aluminibackend-ijym.onrender.com/api/adds"
        // 'https://api.jitalumni.site/api/add'
        , values);
  
      if (response.data.success) {
          setIsSubmitted(true);
      } else {
          throw new Error(response.data.message || 'Registration failed');
      }
  } catch (error: unknown) {  
    if (error instanceof AxiosError) {
        if (error.response?.status === 400) { 
            const errorMessage = error.response.data?.message || "Validation error occurred.";

            if (errorMessage === "User already registered!") {
                alert("User with this email or phone number already exists!");
            } else {
                alert(errorMessage);
            }
        } else {
            console.error("Registration error:", error);
            toast.error(error.message); 
            alert("Failed to submit registration. Please try again.");
        }
    } else {
        console.error("Unexpected error:", error);
        alert("Network error. Please check your connection.");
    }
}finally{
  setButtonLoading(false)
}
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="text-center space-y-4">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold">Registration Successful!</h2>
          <p className="text-muted-foreground">
            Thank you for registering. We'll send you further details via email.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    
  // <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
  //     {/* Instructions Section */}
  //     <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
  //       <h2 className="text-xl font-semibold mb-2">General Guidelines:</h2>
  //       <ul className="list-disc list-inside text-gray-700 space-y-2">
  //         <li>Eligibility: Only registered alumni of JIT are eligible to participate.</li>
  //         <li>Nominations: Self-nominations and peer nominations are allowed.</li>
  //         <li>Supporting Documents: Nominees must provide relevant proof of achievements (certificates, media coverage, etc.).</li>
  //         <li>Deadline: All submissions must be received on or before <strong>23.02.2025 (Sunday) 11:59 PM</strong>.</li>
  //         <li>Privacy Policy: All personal data will be kept confidential and used only for award purposes.</li>
  //         <li>Amendments: The organizing committee reserves the right to amend rules as necessary.</li>
  //       </ul>

  //       <h2 className="text-xl font-semibold mt-4">Selection Process:</h2>
  //       <ul className="list-disc list-inside text-gray-700 space-y-2">
  //         <li>Jury Panel: A panel of impartial judges will evaluate all nominations.</li>
  //         <li>Evaluation Criteria: Based on impact, innovation, leadership, and contribution to society or profession.</li>
  //         <li>Final Decision: The jury’s decision is final and binding.</li>
  //       </ul>

  //       <h2 className="text-xl font-semibold mt-4">Award Ceremony:</h2>
  //       <ul className="list-disc list-inside text-gray-700 space-y-2">
  //         <li>Presence Required: Winners must be present at the event to receive the award.</li>
  //         <li>Disqualification: Misrepresentation of information will lead to disqualification.</li>
  //       </ul>

  //       {/* Agreement Checkbox */}
  //       <div className="mt-4 flex items-center">
  //         <Checkbox id="agree" checked={agreed} onCheckedChange={(value) => setAgreed(value === true)}/>
  //         <label htmlFor="agree" className="ml-2 text-gray-800">
  //           I have read and agree to the guidelines
  //         </label>
  //       </div>
  //     </div>

    <section
      id="registration-form"
      className="min-h-screen flex items-center justify-center p-4  py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-10 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Register for the Reunion</h2>
            <p className="text-muted-foreground mt-2">
              Fill out the form below to secure your spot at the Alumni Reunion 2025
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="khan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="rohith@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+912345678910" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="courseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="UG">UG</SelectItem>
                          <SelectItem value="PG">PG</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select batch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getBatchOptions().map((batch) => (
                            <SelectItem key={batch} value={batch}>
                              {batch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="ECE">ECE</SelectItem>
                          <SelectItem value="EEE">EEE</SelectItem>
                          <SelectItem value="MBA">MBA</SelectItem>
                          <SelectItem value="MECH">MECH</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="familymembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many family members, except yourself, will be attending this event?</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min=""
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="childrens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many kids will be attending this event?</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min=""
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="needstransport"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Transport Facility
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        if (!checked) {
                          form.setValue("transportlocation", undefined ); // Reset performance type when false
                        }
                      }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {needstransport && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="transportlocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pickup location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              <FormField
                control={form.control}
                name="participatingevent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Are you willing to perform in the alumni meet?
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                           field.onChange(checked);
                         if (!checked) {
                           form.setValue("performancetype", undefined ); // Reset performance type when false
                         }
                       }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {participatingevent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="performancetype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>If yes, please select your prefferred events</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select performance type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Solo Dance">Solo Dance</SelectItem>
                            <SelectItem value="Group Dance">Group Dance</SelectItem>
                            <SelectItem value="Solo Singing">Solo Singing</SelectItem>
                            <SelectItem value="Group Singing">Group Singing</SelectItem>
                            <SelectItem value="Mime">Mime</SelectItem>
                            <SelectItem value="Skit">Skit</SelectItem>
                            <SelectItem value="Stand-up Comedy">Stand-up Comedy</SelectItem>
                            <SelectItem value="Instrumental Music Performance">Instrumental Music Performance</SelectItem>
                            <SelectItem value="Magic Show">Magic Show</SelectItem>
                            <SelectItem value="Mimicry">Mimicry</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              <Button type="submit" className="w-full">
                Submit Registration
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </section>
  // </div>
  );
}

export default RegistrationForm;
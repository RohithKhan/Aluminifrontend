"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { AxiosError } from "axios";
import { ArrowLeft, ArrowRight, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  batch: z.string().min(2, "Please select your batch"),
  department: z.string().min(2, "Please select your department"),
  dob: z.string().min(1, "Date of birth is required"),
  contactnumber: z.string().regex(/^[6789]\d{9}$/, "Invalid phone number format").transform((val) => Number(val)),
  alternativenumber:z.string().optional().refine((val) => !val || /^[6789]\d{9}$/.test(val),"Invalid phone number format").transform((val) => (val ? Number(val) : undefined)),
  email: z.string().email("Invalid email address"),
  companyname: z.string().min(2, "Please enter organization name"),
  jobtitle: z.string().min(2, "Please enter designation"),
  linkdinprofile: z.string().optional().refine((value) => !value || /^https?:\/\/(www\.)?linkedin\.com\/(in\/[a-zA-Z0-9-_%]+|company\/[a-zA-Z0-9-_%]+|school\/[a-zA-Z0-9-_%]+|posts\/[a-zA-Z0-9-_%]+|feed\/update\/[a-zA-Z0-9-_%]+|showcase\/[a-zA-Z0-9-_%]+|events\/[a-zA-Z0-9-_%]+|learning\/[a-zA-Z0-9-_%]+|pulse\/[a-zA-Z0-9-_%]+)(\/|\?[\S]*)?$/.test(value), {
    message: "Enter a valid LinkedIn profile URL",
  }),
  currentlocation: z.string().min(2, "Please enter current location"),
  photo: z.any()
    .refine(
      (files: unknown) => {
        if (!files || !(files instanceof FileList) || files.length === 0) return false;

        return Array.from(files).every((file: File) =>
          file.size <= 2 * 1024 * 1024 && // 2MB limit
          ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
        );
      },
      {
        message: "Files must be PDF, JPEG, or PNG and less than 2MB each",
      }
    ),
});

const awardCategorySchema = z.object({
  awardcategory: z.enum([
    "entrepreneurial",
    "social",
    "innovation",
    "campus",
    "sports",
    "women",
    "social-media",
    "cultural"
  ]),
});

const supportingInfoSchema = z.object({
  deservethisaward: z.string().min(100, "This field is required").max(1800, "Description must not exceed 300 words"),
  achievements: z.string(),
  socialcontribution: z.string().optional(),
  recognition: z.string().optional(),
  receivedanyaward:z.boolean({
    required_error: "This field is required",
  }),
  awardandyear:z.string(),
  supportingdocuments: z.any().refine(
      (files: unknown) => {
        if (!files || !(files instanceof FileList) || files.length === 0) return false;

        return Array.from(files).every((file: File) =>
          file.size <= 2 * 1024 * 1024 && // 2MB limit
          ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
        );
      },
      {
        message: "Files must be PDF, JPEG, or PNG and less than 2MB each",
      }
    ),
  mediamentions: z.string().optional(),
}).refine(
  (data) => {
    if (data.receivedanyaward && !data.awardandyear) {
      return false;
    }
    return true;
  },
  {
    message: "Please enter your award and year",
    path: ["awardandyear"],
  }
);

const referencesSchema = z.object({
  referencename: z.string().min(1, "Enter your referencename"),
  organizationname: z.string().optional(),
  numberandemail: z.string().min(1, "Enter your numberandemail"),
  relationship: z.string().optional(),
});

const declarationSchema = z.object({
  declaration: z.boolean(),
});

const formSchema = z.object({})
.extend(personalInfoSchema.shape)
  .extend(awardCategorySchema.shape)
  .extend(supportingInfoSchema._def.schema.shape)
  .extend(referencesSchema.shape)
  .extend(declarationSchema.shape);

const sections = [
  "Personal Information",
  "Award Category",
  "Supporting Information",
  "References",
  "Declaration"
];

const sectionSchemas = [
  personalInfoSchema,
  awardCategorySchema,
  supportingInfoSchema,
  referencesSchema,
  declarationSchema,
];

export default function ExcellenceAwardPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [Buttonloading, setButtonLoading]= useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [supportingDocumentPreview, setsupportingDocumentPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      batch: "",
      department: "",
      dob: "",
      contactnumber: undefined,
      alternativenumber: undefined,
      email: "",
      companyname: "",
      jobtitle: "",
      linkdinprofile: "",
      currentlocation: "",
      awardcategory: undefined,
      deservethisaward: "",
      achievements: "",
      socialcontribution: "",
      recognition: "",
      receivedanyaward: false,
      awardandyear: "",
      referencename: "",
      organizationname: "",
      numberandemail: "",
      relationship: "",
      declaration: false,
    },
  });

  const receivedanyaward = form.watch("receivedanyaward");

  const validateCurrentSection = async () => {
    const currentSectionSchema = sectionSchemas[currentSection];
    const schema = currentSectionSchema instanceof z.ZodEffects
    ? currentSectionSchema._def.schema
    : currentSectionSchema;

  const currentSectionData = form.getValues();

  try {
    await schema.parseAsync(currentSectionData);
    return true;
  } catch (error) {
    Object.keys(schema.shape).forEach((field) => {
      form.trigger(field as any);
    });
    return false;
  }
};

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Form Values Before Processing:", values);
  
      const formData = new FormData();
      const formValues = values as Record<string, any>; // ✅ Type assertion to allow indexing
      
      Object.keys(formValues).forEach((key) => {
          const value = formValues[key]; // ✅ TypeScript now allows indexing
      
          if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
              formData.append(key, String(value)); 
          } else if (Array.isArray(value)) {
              value.forEach((item) => {
                  formData.append(key, String(item));
              });
          } else if (value instanceof File) {
              formData.append(key, value);
          } else if (value !== null && value !== undefined) {
              formData.append(key, JSON.stringify(value));
          }
      });
      
    
    // ✅ Handle "photo" field separately
    if (values.photo) {
        Array.from(values.photo).forEach((file) => {
            if (file instanceof File) {
                formData.append("photo", file);
            } else {
                console.error("Invalid file type for photo:", file);
            }
        });
    }
    
    // ✅ Handle "supportingdocuments" field separately
    if (values.supportingdocuments) {
        Array.from(values.supportingdocuments).forEach((file) => {
            if (file instanceof File) {
                formData.append("supportingdocuments", file);
            } else {
                console.error("Invalid file type for supportingdocuments:", file);
            }
        });
    }
    
    console.log("FormData Object:", formData);

    setButtonLoading(true);
  
      const response = await axios.post(
        // 'http://localhost:8000/api/addAward'
        "https://aluminibackend-ijym.onrender.com/api/addAward"
        , formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });
  
      if (response.data.success) {
          alert("Submitted Successfully");
          setIsSubmitted(true);
      } else {
          throw new Error(response.data.message || "Submission failed");
      }
  } catch (error: unknown) { // ✅ Explicitly declare error as "unknown"
    if (error instanceof AxiosError) { // ✅ Ensure error is an AxiosError
        if (error.response?.status === 400) {  // ✅ Use optional chaining "?."
            const errorMessage = error.response.data?.message || "Validation error occurred.";
            alert("Contact the administrator for further assistance. \n Mr.Stephen A R \n Vice President - JIT Alumni \n Association \n 7397456883 ");

            if (errorMessage === "User already registered!") {
                alert("User with this email already exists!");
            } else {
                alert(errorMessage);
            }
        }
    } else {
        console.error("Unexpected error:", error);
        alert("Network error. Please check your connection.");
        alert("Contact the administrator for further assistance. \n Mr.Stephen A R \n Vice President - JIT Alumni \n Association \n 7397456883 ");
    }
}finally{
  console.log("present")
  setTimeout( ()=> setButtonLoading(false), 2000);
  console.log("5 years later")
}
    };

  const handleNext = async () => {
    const isValid = await validateCurrentSection();
    if (isValid && currentSection < sections.length - 1) {
      console.log(currentSection)
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateCurrentSection();
    if (isValid && currentSection === sections.length - 1) {
      const values = form.getValues();
      if (!values.declaration) {
        form.setError('declaration', {
          type: 'manual',
          message: 'Please accept the declaration to submit'
        });
        return;
      }
      await onSubmit(values);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setsupportingDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary py-8">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-card rounded-xl shadow-lg p-8 text-center"
          >
            <div className="space-y-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              <h2 className="text-3xl font-bold">Application Submitted Successfully!</h2>
              <p className="text-muted-foreground text-lg">
                Thank you for applying for the JIT Alumni Excellence Awards. We will review your application and get back to you soon.
              </p>
              <Link href="/">
                <Button className="mt-8">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-6">
           

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name (As per records)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "2011-2015",
                          "2012-2016",
                          "2013-2017",
                          "2015-2019",
                          "2016-2020",
                          "2017-2021",
                          "2018-2022",
                          "2019-2023",
                          "2020-2024",
                        ].map((batch) => (
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

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            </div>

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactnumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternativenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Number (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ID</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Organization/Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation/Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkdinprofile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentlocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location (City, Country)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="photo"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormDescription>
                    Upload a professional photo (JPEG or PNG, max 2MB)
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleImageChange(e);
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        {...field}
                      />
                      {profileImagePreview && (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="awardcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Award Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an award category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entrepreneurial">Entrepreneurial Excellence Award</SelectItem>
                      <SelectItem value="social">Social Leadership Award</SelectItem>
                      <SelectItem value="innovation">Excellence in Innovation & Tech Award</SelectItem>
                      <SelectItem value="campus">Campus Connection Award</SelectItem>
                      <SelectItem value="sports">Sports Excellence Award</SelectItem>
                      <SelectItem value="women">Women Achiever Award</SelectItem>
                      <SelectItem value="social-media">Social Media Star Award</SelectItem>
                      <SelectItem value="cultural">Cultural Icon Award</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="deservethisaward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why do you deserve this award? (Max 300 words)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your achievements and contributions..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Achievements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List your key professional achievements..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialcontribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Contributions (if applicable)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your social contributions..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recognition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recognitions & Awards</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List your recognitions and awards..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
                control={form.control}
                name="receivedanyaward"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Have received any award or recognition from our institution previously
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        if (!checked) {
                          form.setValue("awardandyear", ""); 
                        }
                      }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {receivedanyaward && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="awardandyear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What award and year</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your award and year" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

            <FormField
              control={form.control}
              name="supportingdocuments"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Supporting Documents</FormLabel>
                  <FormDescription>
                    Upload relevant certificates, portfolio, research papers, or awards (PDF, JPEG, PNG, max 2MB each)
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>  {
                          onChange(e.target.files);
                          handleDocumentChange(e);
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        {...field}
                      />
                      {supportingDocumentPreview && (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={supportingDocumentPreview}
                            alt="Document preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      )}
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mediamentions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media Mentions</FormLabel>
                  <FormDescription>
                    Add links to news articles, interviews, blogs, or videos featuring your work (one per line)
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="https://example.com/article
https://example.com/interview"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="referencename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Name & Designation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizationname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization/Institution Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberandemail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number & Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship with the Applicant</FormLabel>
                  <FormControl>
                    <Input placeholder="Professor, Employer, Mentor, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="declaration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I confirm that the information provided is accurate and true. I consent to the use of my details
                      for the JIT Alumni Excellence Awards selection process and authorize the Alumni Committee to verify
                      my credentials if required.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary py-8">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-xl shadow-lg p-6 md:p-10 space-y-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                JIT Alumni Excellence Awards
              </h1>
              <p className="text-muted-foreground">
                Recognizing outstanding alumni for their achievements and contributions
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2">
                {sections.map((section, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentSection
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < sections.length - 1 && (
                      <div
                        className={`h-0.5 w-8 ${
                          index < currentSection ? "bg-primary" : "bg-secondary"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-semibold mb-6">{sections[currentSection]}</h2>
                    {renderSection()}
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-between pt-6">
                  {currentSection > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentSection(currentSection - 1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                  )}
                  {currentSection === sections.length - 1 ? (
                    <Button
                      type="button"
                      className="ml-auto"
                      onClick={handleSubmit}
                      disabled={Buttonloading || isSubmitted}
                    >
                      {Buttonloading ? "Submitting..." : "Submit Application"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className={currentSection === 0 ? "w-full" : "ml-auto"}
                      onClick={handleNext}
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
                {Buttonloading && (
                        <p className="text-sm text-green-600 text-muted-foreground mt-2">
                          Please wait while your file is being uploaded...
                        </p>
                      )}
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
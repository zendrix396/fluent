"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "@/icons/lucide";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    quote: "Fluent transformed our research workflow. What used to take weeks of manual analysis now happens in minutes. The polynomial functions it generates are incredibly accurate for our climate data modeling.",
    author: "Dr. Sarah Chen",
    title: "Lead Research Scientist",
    company: "Climate Research Institute",
    image: "/api/placeholder/48/48",
    companyLogo: "/api/placeholder/120/40"
  },
  {
    id: 2,
    quote: "As a financial analyst, I work with massive datasets daily. Fluent's ability to automatically detect patterns and generate mathematical functions has revolutionized how we model market trends.",
    author: "Michael Rodriguez",
    title: "Senior Financial Analyst", 
    company: "Investment Capital Group",
    image: "/api/placeholder/48/48",
    companyLogo: "/api/placeholder/120/40"
  },
  {
    id: 3,
    quote: "The LaTeX export feature is a game-changer for academic publishing. I can upload my experimental data and get publication-ready visualizations with corresponding mathematical functions instantly.",
    author: "Prof. Emily Watson",
    title: "Professor of Statistics",
    company: "Stanford University",
    image: "/api/placeholder/48/48", 
    companyLogo: "/api/placeholder/120/40"
  },
  {
    id: 4,
    quote: "Fluent handles our complex multi-variable datasets beautifully. The 3D visualizations and polynomial regression models help our engineering team make data-driven decisions faster than ever.",
    author: "David Kim",
    title: "Data Engineering Manager",
    company: "TechFlow Systems",
    image: "/api/placeholder/48/48",
    companyLogo: "/api/placeholder/120/40"
  },
  {
    id: 5,
    quote: "The predictive capabilities are outstanding. We feed in historical sales data and Fluent generates functions that accurately forecast future trends. It's become essential for our business planning.",
    author: "Lisa Thompson",
    title: "Business Analytics Director", 
    company: "RetailMetrics",
    image: "/api/placeholder/48/48",
    companyLogo: "/api/placeholder/120/40"
  },
  {
    id: 6,
    quote: "As a PhD student, I was struggling with complex data analysis. Fluent not only solved my equations but helped me understand the underlying mathematical relationships in my research data.",
    author: "Alex Johnson",
    title: "PhD Candidate",
    company: "MIT",
    image: "/api/placeholder/48/48",
    companyLogo: "/api/placeholder/120/40"
  }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-24 bg-background">
            <div className="container">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-8">
                        <Image
                            src={currentTestimonial.companyLogo}
                            alt={`${currentTestimonial.company} logo`}
                            width={120}
                            height={40}
                            className="mx-auto opacity-60"
                        />
                    </div>

                    <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-12">
                        &quot;{currentTestimonial.quote}&quot;
                    </blockquote>

                    <div className="flex items-center justify-center gap-4 mb-12">
                        <Image
                            src={currentTestimonial.image}
                            alt={currentTestimonial.author}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                        <div className="text-left">
                            <div className="font-semibold text-white">{currentTestimonial.author}</div>
                            <div className="text-sm text-text-secondary">
                                {currentTestimonial.title}, {currentTestimonial.company}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={prevTestimonial}
                            className="p-2 text-text-secondary hover:text-white transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 w-8 rounded-full transition-colors ${
                                        index === currentIndex ? 'bg-accent-primary' : 'bg-border'
                                    }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="p-2 text-text-secondary hover:text-white transition-colors"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
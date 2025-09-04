"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordian";

const faqData = [
  {
    question: "What data formats does Fluent support?",
    answer:
      "Fluent accepts a wide variety of data formats including Excel files (.xlsx, .xls), CSV files, JSON data, and manual array-based input. You can upload files directly or paste data into our interface. Our system automatically detects the structure and prepares your data for analysis.",
  },
  {
    question: "How accurate are the mathematical functions Fluent generates?",
    answer:
      "Fluent uses advanced regression algorithms and machine learning techniques to generate highly accurate mathematical functions. For polynomial equations like 3x²+5x+7 or multi-variable functions like 3x+5y+2=8, we typically achieve R² values above 0.95. The accuracy depends on your data quality and the underlying relationships in your dataset.",
  },
  {
    question: "Can Fluent handle large datasets?",
    answer:
      "Yes, Fluent is designed to scale with your data needs. We can process datasets with millions of data points efficiently. For extremely large datasets, our system uses optimized algorithms and cloud computing resources to ensure fast processing times while maintaining accuracy.",
  },
  {
    question: "What types of visualizations does Fluent create?",
    answer:
      "Fluent generates a comprehensive range of visualizations including scatter plots, line graphs, 3D surface plots, contour maps, regression curves, and residual plots. All visualizations are publication-ready and automatically formatted for inclusion in your LaTeX documents.",
  },
  {
    question: "How does the LaTeX export feature work?",
    answer:
      "Fluent automatically generates complete LaTeX documents containing your data visualizations, mathematical functions, statistical analysis, and formatted tables. The documents are ready for academic publication or professional reports, with proper mathematical notation and high-quality figures.",
  },
  {
    question: "Do I need statistical knowledge to use Fluent?",
    answer:
      "Not at all. Fluent is designed for users of all technical backgrounds. While having statistical knowledge can help you interpret results more deeply, our platform provides clear explanations, intuitive visualizations, and automatically selects the best analytical approaches for your data.",
  },
  {
    question: "Can Fluent predict future values based on my data?",
    answer:
      "Yes, once Fluent generates mathematical functions from your historical data, you can input new values to predict outcomes. The system provides confidence intervals and accuracy metrics to help you understand the reliability of predictions.",
  },
  {
    question: "How quickly can I get results from my data?",
    answer:
      "Most analyses complete within minutes. Simple datasets with clear patterns can be processed in seconds, while complex multi-variable analyses might take a few minutes. The LaTeX document generation typically adds just another minute to the process.",
  },
];

const Faq = () => {
  return (
    <section className="bg-background py-24 sm:py-16">
      <div className="mx-auto max-w-[704px] px-4">
        <h2 className="text-center text-[34px] font-semibold leading-snug tracking-tighter text-foreground sm:text-[28px]">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-12 w-full sm:mt-8">
          {faqData.map((faq, index) => (
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className="border-b border-border last:border-b-0"
            >
              <AccordionTrigger className="gap-x-4 py-6 text-left text-[20px] font-medium leading-snug tracking-tight text-foreground hover:text-muted-foreground hover:no-underline sm:text-[18px]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 pt-0">
                <p className="text-[18px] leading-snug tracking-tight text-muted-foreground">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
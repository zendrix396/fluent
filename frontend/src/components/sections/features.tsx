import { BarChart3, Calculator, FileDown, Database, TrendingUp } from "@/icons/lucide";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const featuresData: Feature[] = [
  {
    icon: BarChart3,
    title: "Smart Data Visualization",
    description:
      "Generate stunning charts, graphs, and plots automatically from your data. Bar charts, scatter plots, line graphs, and more.",
  },
  {
    icon: Calculator,
    title: "Mathematical Function Generation",
    description:
      "Discover hidden patterns with automatic polynomial generation. From simple linear equations to complex multi-variable functions like 3x²+5x+7=1.",
  },
  {
    icon: FileDown,
    title: "Professional LaTeX Export",
    description:
      "Export your complete analysis as publication-ready LaTeX documents with embedded graphs and mathematical formulations.",
  },
  {
    icon: Database,
    title: "Flexible Data Input",
    description:
      "Upload Excel files, CSV, JSON, or input manual arrays. Fluent handles any data format and structure seamlessly.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description:
      "Input new data points and get instant predictions using the mathematical models generated from your dataset.",
  },
];

const Features = () => {
  return (
    <section className="bg-background py-24 px-6 sm:px-4">
      <div className="mx-auto max-w-5xl">
        <span className="mb-2.5 block text-sm font-medium uppercase leading-none tracking-tight text-primary md:mb-2 md:text-[13px]">
          Why Fluent?
        </span>
        <h2 className="mt-5 max-w-[640px] text-[56px] font-semibold leading-tight tracking-tighter text-white text-balance lg:text-5xl md:mt-4 md:max-w-sm md:text-4xl sm:mt-3.5 sm:text-[28px]">
          Transform your data into mathematical insights with precision
        </h2>
        <ul className="mt-20 flex flex-col gap-y-6 lg:mt-16 md:mt-12 md:gap-y-5 sm:mt-10 sm:gap-y-6">
          {featuresData.map((feature, index) => (
            <li
              key={index}
              className="-mt-px flex cursor-pointer items-center justify-between border-b border-border pb-6 last:border-none last:pb-0 transition-transform duration-200 hover:-translate-y-1 md:pb-5 sm:flex-col sm:items-start sm:gap-y-1.5 sm:pb-6"
            >
              <div className="flex items-center gap-x-[18px] md:gap-x-3 sm:flex-col sm:items-start sm:gap-y-[18px]">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-border md:h-[52px] md:w-[52px] sm:h-12 sm:w-12">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium leading-snug tracking-tighter text-white lg:tracking-tight md:text-lg">
                  {feature.title}
                </h3>
              </div>
              <p className="max-w-[544px] text-xl leading-snug tracking-tight text-muted-foreground lg:max-w-lg lg:text-lg md:max-w-[352px] md:text-base sm:max-w-none">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
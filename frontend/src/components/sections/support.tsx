import Image from "next/image";

interface SupportCard {
  image: string;
  title: string;
  description: string;
}

const supportCards: SupportCard[] = [
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/images/next-413889-workflow.b1d07d94.jpg",
    title: "Need help defining your workflow?",
    description: "We’ll help map your use case, define inputs/outputs, and pick the right agent for your goals.",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/images/next-418601-setup.9307e7f5.jpg",
    title: "Need help with setup?",
    description: "We handle integrations, memory, routing, and workflows — and make sure it all runs in production.",
  },
  {
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/images/next-650855-changes.00932302.jpg",
    title: "Need help with changes?",
    description: "We train the agent, test edge cases, monitor performance, and keep it updated as things change.",
  },
];

const SupportSection = () => {
  return (
    <section className="pt-[192px] lg:pt-[128px] md:pt-[104px] sm:pt-16">
      <div className="container mx-auto text-center max-w-xl">
        <h2 className="text-[56px] font-semibold leading-[1.1] tracking-tighter text-text-primary lg:text-balance lg:text-[48px] md:text-[36px] sm:text-[28px]">
          We&apos;re there when you need us
        </h2>
        <p className="mt-5 text-[20px] leading-snug tracking-tight text-text-secondary lg:mt-4 lg:text-[18px] md:mt-[14px] md:text-base">
          Scout&apos;s team is here for whatever support you need — from onboarding to troubleshooting. We give a whole new meaning to &quot;white glove.&quot;
        </p>
      </div>
      <div className="container mx-auto mt-20 lg:mt-16 md:mt-12 sm:mt-10">
        <ul className="grid grid-cols-3 gap-x-[14px] md:gap-x-3 sm:grid-cols-1 sm:gap-x-0 sm:gap-y-6">
          {supportCards.map((card, index) => (
            <li key={index} className="group">
              <div className="relative overflow-hidden rounded-[10px]">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={386}
                  height={248}
                  className="w-full h-auto object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
                />
              </div>
              <h3 className="mt-[18px] text-[20px] font-medium leading-snug tracking-tighter text-text-primary lg:text-[18px] md:mt-3 md:text-base">
                {card.title}
              </h3>
              <p className="mt-[10px] max-w-[350px] text-base leading-relaxed text-text-secondary lg:text-[15px] md:mt-2 md:text-sm">
                {card.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SupportSection;
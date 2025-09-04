import Image from 'next/image';

const integrations = [
  { name: 'Google Calendar', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/92af2a2b3be2328ae970e666d524938d-28.svg' },
  { name: 'Slack', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/9dfacfe7eb597d0f5fba7f6b4df77c9d-29.svg' },
  { name: 'Linear', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/389df731baa55947f77731cdb992b6a9-30.svg' },
  { name: 'Attio', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/b196d9fb5f8d42c33f638a9abe4aabc6-31.svg' },
  { name: 'Salesforce', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/58966816529b9a50a15693bc6d446e3f-32.svg' },
  { name: 'Github', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/669e570b920dbae017c3a76fbdd44269-33.svg' },
  { name: 'Gmail', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/c8add1fbccda968af1636949f7ea7036-34.svg' },
  { name: 'PayPal', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/b3c59f6048730316c928b1aec167f659-35.svg' },
  { name: 'Notion MCP', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/5094f0a661d697c4c95a7de2999c2109-36.svg' },
  { name: 'HubSpot', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/b3947bde4822dd1d61da50a85ec76e24-37.svg' },
  { name: 'Square Up', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/642a1a527e04136efb25376892c1ee72-38.svg' },
  { name: 'MCP', logo: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/cf16bf08-f64a-43aa-b8bd-12779767208c-scoutos-com/assets/svgs/1897582ec232b5e1555dcad2db7609bc-39.svg' },
];

const IntegrationsSection = () => {
    return (
        <section className="bg-background px-6">
            <div className="mx-auto max-w-5xl relative">
                <div className="border-t border-border pt-20 lg:pt-16 md:pt-14 sm:pt-10">
                    <div className="flex items-start justify-between gap-x-20 lg:gap-x-12 md:flex-col md:gap-y-8 sm:gap-y-6">
                        <p className="max-w-[192px] text-lg font-medium leading-normal tracking-tight text-text-secondary lg:text-base md:max-w-none">
                            Connect Scout to all your tools with built-in integrations.
                        </p>
                        <ul className="grid w-full max-w-[704px] grid-cols-3 gap-x-12 gap-y-11 lg:gap-y-8 md:max-w-none md:gap-y-6 sm:grid-cols-2">
                            {integrations.map((integration) => (
                                <li key={integration.name} className="flex items-center gap-x-3.5 text-base font-medium tracking-tight text-foreground">
                                    <Image
                                        src={integration.logo}
                                        alt={integration.name}
                                        width={26}
                                        height={26}
                                    />
                                    {integration.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IntegrationsSection;
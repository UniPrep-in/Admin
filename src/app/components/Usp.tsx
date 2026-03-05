import Image from "next/image";

export default function Usp() {
  const leftLines = [
    {
      title: "Unlimited Resources",
      comment: "Discover a treasure trove of courses, tools, and resources.",
    },
    {
      title: "Diverse Course Library",
      comment: "Learn about hundreds of topics across multiple domains.",
    },
    {
      title: "Schedule-flexible",
      comment: "Learn at your own pace with 24/7 access to all courses and materials.",
    },
  ];

  const rightLines = [
    {
      title: "50+ Expert Instructors",
      comment: "Each instructor on our platform has years of experience.",
    },
    {
      title: "Industry Certificates",
      comment: "Enhance your career prospects with recognized certifications.",
    },
    {
      title: "Dedicated Support",
      comment: "Get assistance whenever you need it with our responsive support team.",
    },
  ];

  return (
    <main className="min-h-screen py-12 bg-white rounded-t-4xl border-t border-neutral-200">
    <div className="flex justify-center items-center">
        <h1 className="max-w-xl text-center text-6xl text-black">Steady progress, endless potential</h1>
    </div>
    <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="space-y-10">
            {leftLines.map((item) => (
              <div key={item.title} className="text-left">
                <h3 className="text-2xl text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-800 leading-relaxed">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center items-center order-first lg:order-none">
            <div className="relative w-full max-w-sm aspect-square rounded-full border border-neutral-300">
              <Image
                src="/assets/usp.avif"
                alt="Platform Preview"
                fill
                className="object-cover rounded-full p-4"
                priority
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {rightLines.map((item) => (
              <div key={item.title} className="text-right">
                <h3 className="text-2xl text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-800 leading-relaxed">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
    </main>
  );
}
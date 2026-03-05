import { FaUserGraduate } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { MdOutlineMenuBook } from "react-icons/md";

export default function Feature() {
  const features = [
    {
      icon: <FaUserGraduate className="text-blue-500 text-3xl md:text-4xl" />,
      title: "Expert-led courses",
      description: "Gain insights from industry leaders in areas such as technology, business, and creative arts.",
    },
    {
      icon: <FaBagShopping className="text-blue-500 text-3xl md:text-4xl" />,
      title: "Purchase Course",
      description: "Unlock new career opportunities by learning from industry experts in various fields, including technology and business.",
    },
    {
      icon: <MdOutlineMenuBook className="text-blue-500 text-3xl md:text-4xl" />,
      title: "Interactive learning",
      description: "Engage with seasoned experts in diverse fields such as marketing, design, development, finance, and more.",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl text-center text-black leading-tight">
          Choose us because of our experience
        </h1>
        <p className="text-base sm:text-lg max-w-2xl text-center text-neutral-600 leading-relaxed">
          Let&apos;s nurture potential, empower minds, and foster growth through education and collaboration to shape a brighter future.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 md:p-8 flex flex-col gap-6 md:gap-8 h-full"
          >
            {/* Icon */}
            <div className="p-3 md:p-4 rounded-full bg-blue-50 w-fit shadow-md">
              {feature.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 md:gap-3">
              <h2 className="text-black text-lg md:text-xl">
                {feature.title}
              </h2>
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
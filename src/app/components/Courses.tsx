import Link from "next/link";

export default function Courses() {
  return (
    <main className="mx-auto max-w-6xl">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-black text-6xl">Check Out Our Courses</h1>
          <p className="text-lg max-w-xl text-black">
            Join our learning community to enhance your skills and knowledge,
            paving the way for a successful future.
          </p>
        </div>

        <div className="">
          <Link className="px-6 shadow-xl py-4 text-lg bg-linear-to-br text-white rounded-full from-blue-400 to-blue-600" href="">
            All Courses
          </Link>
        </div>
      </div>
    </main>
  );
}

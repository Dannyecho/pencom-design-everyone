import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-[#F6F8F3] px-4 py-28 text-center text-[#1C4226]">
      <p className="font-mono text-7xl font-bold text-[#CB9615]">404</p>
      <h1 className="mt-4 text-3xl font-bold">We can’t find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-gray-700">The address may be mistyped, or the page may have moved.</p>
      <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-[#105D1D] px-5 font-semibold text-white hover:bg-[#14892A]">
        Go to the home page
      </Link>
    </section>
  );
}

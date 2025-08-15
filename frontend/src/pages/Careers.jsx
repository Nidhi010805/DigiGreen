// client/src/pages/Careers.jsx

export default function Careers() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-6">Careers at EcoLoop</h1>

      <p className="text-gray-700 text-lg leading-relaxed">
        Join our passionate team on a mission to create a sustainable, reusable packaging future.
    At <span className="font-semibold text-green-500">EcoLoop</span>, we believe that innovation and impact go hand-in-hand.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Why Work With Us?</h2>
        <ul className="list-disc list-inside text-gray-700 text-base">
          <li>Be part of a purpose-driven startup solving real-world problems.</li>
          <li>Collaborate with a diverse, mission-aligned team.</li>
          <li>Operations Associates to support inventory optimization strategies.</li>
          <li>Enjoy flexible work culture and hybrid opportunities.</li>
          <li>Grow with learning sessions, hackathons, and sustainability workshops.</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Open Roles</h2>
        <p className="text-gray-700 mb-4">
          We're always looking for great minds in design, development, marketing, and operations. Send your resume or portfolio to <a href="mailto:careers@repack.com" className="text-green-700 underline">careers@ecoloop.com</a>
        </p>
        <p className="text-gray-600 text-sm italic">* We welcome interns and volunteers passionate about the environment.</p>
      </div>
    </div>

  );
}
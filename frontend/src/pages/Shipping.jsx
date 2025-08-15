// client/src/pages/Shipping.jsx

export default function Shipping() {
  return (
    <div className="p-6 max-w-3xl mx-auto my-16 mt-8">
  <h1 className="text-4xl font-bold text-green-600 mb-6">Shipping Information</h1>

  <p className="text-gray-700 text-lg leading-relaxed">
    EcoLoop makes shipping sustainable by working with eco-conscious logistics partners. Every package you return is handled with care to ensure it’s safely processed and reused.  
    <br /><br />
    Our intelligent route optimizer ensures faster and more efficient pickups by mapping the shortest and most eco-friendly delivery paths — reducing delays and emissions.
  </p>

  <div className="mt-8 space-y-6">
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-green-600">Where do I send returns?</h2>
      <p className="text-gray-700 mt-1">
        Return locations are listed in your Scan Return page. You can also schedule pickups in supported cities.
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-green-600">Are return shipments free?</h2>
      <p className="text-gray-700 mt-1">
        Yes, all returns are prepaid by EcoLoop through our retail partners. Just print or scan the digital return label.
      </p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-green-600">How are packages reused?</h2>
      <p className="text-gray-700 mt-1">
        Returned packaging is sanitized, inspected, and sent back into circulation after quality checks.
      </p>
    </div>
  </div>
</div>

  );
}
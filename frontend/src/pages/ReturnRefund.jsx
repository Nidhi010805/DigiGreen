import React from 'react'

const ReturnRefund = () => {
  return (
    <div>
      <div className="p-6 max-w-4xl mx-auto">
  <h1 className="text-4xl font-bold text-green-700 mb-6">Return & Refund Policy</h1>

  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
    At <span className="font-semibold text-green-700">EcoLoop</span>, we’re committed to creating a sustainable and seamless experience for both users and retailers. Our return and refund process is designed to be transparent, efficient, and eco-conscious.
  </p>

  {/* Return Eligibility */}
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-green-600 mb-2">Eligibility for Returns</h2>
    <ul className="list-disc list-inside text-gray-700 space-y-1">
      <li>Returns are only applicable to packaging materials associated with your EcoLoop orders.</li>
      <li>Returned packaging must be clean, undamaged, and meet the material guidelines listed on the platform.</li>
      <li>Returns must be initiated within <span className="font-medium">7 days</span> of delivery for point eligibility.</li>
    </ul>
  </div>

  {/* Refund (Green Points & Cashback) */}
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-green-600 mb-2">Green Points & Cashback</h2>
    <p className="text-gray-700 mb-2">
      Once your return is approved:
    </p>
    <ul className="list-disc list-inside text-gray-700 space-y-1">
      <li>You’ll receive <span className="text-green-700 font-medium">Green Points</span> in your account dashboard.</li>
      <li>If you chose cashback, it will be processed within <span className="font-medium">3–5 business days</span>.</li>
      <li>Green Points are non-transferable and expire after 6 months if unused.</li>
    </ul>
  </div>

  {/* Pickup & Shipping Info */}
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-green-600 mb-2">Pickup & Logistics</h2>
    <p className="text-gray-700">
      In supported cities, EcoLoop offers free pickup for eligible returns. Users outside pickup zones can drop off returns at listed partner locations.
    </p>
  </div>

  {/* Non-Returnable Items */}
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-green-600 mb-2">Non-Returnable Items</h2>
    <p className="text-gray-700">
      We currently do not accept returns of items that are not part of packaging (e.g., personal items, product contents, or damaged goods unrelated to EcoLoop).
    </p>
  </div>

  {/* Contact Info */}
  <div className="mb-6">
    <h2 className="text-2xl font-semibold text-green-600 mb-2">Need Help?</h2>
    <p className="text-gray-700">
      If you have questions or concerns regarding your return, please email us at:{" "}
      <a href="mailto:support@ecoloop.com" className="text-green-700 underline">support@ecoloop.com</a>
    </p>
  </div>
</div>

    </div>
  )
}

export default ReturnRefund



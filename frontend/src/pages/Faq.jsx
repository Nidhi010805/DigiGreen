// client/src/pages/Faq.jsx

export default function Faq() {
  const faqs = [
    {
        question: "What is EcoLoop?",
        answer:
          "EcoLoop is a platform that encourages sustainable behavior by allowing users to return packaging materials in exchange for Green Points, which can be redeemed for cashback or rewards.",
      },
      {
        question: "How do I earn Green Points?",
        answer:
          "You earn Green Points every time you return packaging materials from your previous orders through our platform. The points depend on the type and quantity of material returned.",
      },
      {
        question: "What can I redeem my Green Points for?",
        answer:
          "Green Points can be redeemed as cashback, discounts on future purchases, or eco-friendly gifts listed in your rewards dashboard.",
      },
      {
        question: "I'm a retailer. How does EcoLoop help me?",
        answer:
          "EcoLoop provides insights into top-selling products, helps with inventory forecasting, and offers optimized delivery paths to reduce delay and improve operational efficiency.",
      },
      {
        question: "Is EcoLoop free to use?",
        answer:
          "Yes! EcoLoop is free for customers. Retailers may opt into premium analytics tools or logistics enhancements.",
      },
      {
        question: "Can I return any type of packaging?",
        answer:
          "We currently support returns for paper, cardboard, and certain plastic materials used in packaging. You’ll find eligible materials listed during the return process.",
      },
      {
        question: "How do retailers benefit from GreenChain technology?",
        answer:
          "GreenChain enables smarter delivery routes, predictive inventory restocking, and transparency in product demand — helping retailers reduce waste and increase customer satisfaction.",
      }
  ];

  return (
    <div className="p-6 max-w-3xl my-16 mx-auto">
  <h1 className="text-4xl font-bold text-green-600 mb-6">Frequently Asked Questions</h1>

  <div className="space-y-6">
    {faqs.map((faq, idx) => (
      <div key={idx} className="space-y-1">
        <p className="font-semibold text-green-700">Q: {faq.question}</p>
        <p className="text-gray-700">A: {faq.answer}</p>
      </div>
    ))}
  </div>
</div>
  );
}
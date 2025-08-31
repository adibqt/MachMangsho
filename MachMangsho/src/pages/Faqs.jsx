import React, { useMemo, useState } from 'react';

const faqsData = [
  {
    category: 'Ordering & Delivery',
    items: [
      {
        q: 'How fast do you deliver?',
        a: 'Most orders arrive within 30–60 minutes depending on your location and order size. You can see ETA at checkout.'
      },
      {
        q: 'Can I schedule a delivery?',
        a: 'No , We are currently unable to offer scheduled deliveries.'
      },
      {
        q: 'What are the delivery charges?',
        a: 'Delivery fees vary by location and order value. Orders above the free-delivery threshold show no charge at checkout.'
      },
    ],
  },
  {
    category: 'Payments & Refunds',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery and secure online payments. Your card details are processed by our payment partner.'
      },
      {
        q: 'How do refunds work?',
        a: 'Refunds are processed to your original payment method. COD refunds are issued as store credit or bank transfer.'
      },
      {
        q: 'Is online payment safe?',
        a: 'Yes. We use SSL encryption and never store raw card details. Payments are handled by PCI-compliant providers.'
      },
    ],
  },
  {
    category: 'Products & Quality',
    items: [
      {
        q: 'Are your products fresh?',
        a: 'Absolutely. We partner with trusted suppliers and maintain strict cold-chain and quality checks.'
      },
      {
        q: 'What if an item is unavailable?',
        a: 'We’ll notify you promptly and suggest replacements. You can accept, skip, or cancel that item.'
      },
      {
        q: 'How do discounts and deals work?',
        a: 'Deals are auto-applied. If a product has a discount, you’ll see the original and offer price on the product page.'
      },
    ],
  },
  {
    category: 'Account & Support',
    items: [
      {
        q: 'How do I track my order?',
        a: 'Go to My Orders to view your orders. You’ll receive updates via email as well.'
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Use the Forgot Password option on the login screen. We’ll email you a secure reset link.'
      },
      {
        q: 'How do I contact support?',
        a: 'Use the Contact Us link in the footer or reply to any order email. Our team typically responds within a few hours.'
      },
    ],
  },
];

const QAItem = ({ q, a, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border border-gray-200 rounded-lg bg-white transition overflow-hidden ${open ? 'shadow-md' : 'shadow-sm'}`}>
      <button
        className="w-full flex items-center justify-between text-left px-4 md:px-5 py-3 md:py-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 pr-3">{q}</span>
        <span className={`ml-4 inline-flex w-6 h-6 items-center justify-center rounded-full text-white text-sm transition-transform ${open ? 'bg-emerald-500 rotate-45' : 'bg-gray-900'}`}>+</span>
      </button>
      <div className={`px-4 md:px-5 pb-4 text-sm text-gray-600 leading-6 ${open ? 'block' : 'hidden'}`}>{a}</div>
    </div>
  );
};

const Faqs = () => {
  const groups = useMemo(() => faqsData, []);
  return (
    <div className="py-8 md:py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Quick answers to common questions about ordering, payments, delivery, and support.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {groups.map((group, idx) => (
          <section key={group.category} className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">{group.category}</h2>
            {group.items.map((item, i) => (
              <QAItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0 && (idx === 0 || idx === 1)} />
            ))}
          </section>
        ))}
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        Can’t find your answer? <a href="#" className="text-emerald-600 hover:underline">Contact Support</a>
      </div>
    </div>
  );
};

export default Faqs;

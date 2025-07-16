'use client';

import { useState } from 'react';

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How does DocShot AI capture screenshots?",
      answer: "DocShot AI uses headless browser technology (Puppeteer) to capture pixel-perfect screenshots of your web pages. You can configure specific elements, viewports, wait conditions, and scheduling options through our intuitive interface or YAML configuration files."
    },
    {
      question: "What integrations are available?",
      answer: "We support major platforms including GitHub (automatic commits), Notion (page updates), Confluence (content sync), Slack (notifications), and generic webhooks. Our API also allows custom integrations with any platform that accepts HTTP requests."
    },
    {
      question: "How accurate is the visual diff detection?",
      answer: "Our visual diff engine uses advanced pixel-by-pixel comparison with configurable sensitivity thresholds. It can detect even subtle changes while filtering out insignificant differences like anti-aliasing variations. You can adjust sensitivity levels based on your needs."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We're SOC 2 compliant and offer enterprise-grade security features including SSO integration, audit logs, and on-premise deployment options for sensitive environments."
    },
    {
      question: "Can I use my own storage?",
      answer: "Absolutely! While we provide secure cloud storage by default, you can configure DocShot AI to use your own S3-compatible storage, including AWS S3, Google Cloud Storage, or on-premise solutions. This gives you complete control over your screenshot data."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up for a free account, create your first project, and add screenshot configurations. You can start with our web interface and later graduate to YAML configurations and API integrations as your needs grow. No credit card required for the free tier."
    },
    {
      question: "What happens if I exceed my screenshot limit?",
      answer: "We'll notify you as you approach your limit. If you exceed it, we'll temporarily pause screenshot capture and send you upgrade options. Your existing screenshots and configurations remain intact, and you can upgrade anytime to resume service."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. We offer a 30-day money-back guarantee for annual plans. When you cancel, you'll retain access to your account until the end of your billing period, and you can export all your data."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes! We provide custom solutions for enterprise customers including on-premise deployment, custom integrations, dedicated support, SLA guarantees, and tailored pricing. Contact our sales team to discuss your specific requirements."
    },
    {
      question: "How reliable is the service?",
      answer: "We maintain 99.9% uptime with redundant infrastructure across multiple regions. Our monitoring systems ensure rapid response to any issues, and we provide status page updates for transparency. Enterprise customers get additional SLA guarantees."
    }
  ];

  return (
    <section id="faq" className="py-20 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about DocShot AI. Can't find what you're looking for? 
            <a href="/contact" className="text-blue-600 hover:text-blue-800 ml-1">Contact our support team</a>.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional help */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you get the most out of DocShot AI. 
              We typically respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Contact Support
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
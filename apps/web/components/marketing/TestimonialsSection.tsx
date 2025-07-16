export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "DocShot AI saved us 10+ hours per week on documentation maintenance. Our screenshots are always up-to-date and our docs look professional.",
      author: "Sarah Chen",
      role: "Head of Documentation",
      company: "TechFlow Inc",
      avatar: "SC",
    },
    {
      quote: "The visual diff detection is incredible. We catch UI regressions immediately and our release notes always have accurate screenshots.",
      author: "Marcus Rodriguez",
      role: "Product Manager",
      company: "DataSync Pro",
      avatar: "MR",
    },
    {
      quote: "Integration with GitHub was seamless. Screenshots automatically update in our docs repository whenever we deploy changes.",
      author: "Emily Watson",
      role: "Lead Developer",
      company: "CloudBase",
      avatar: "EW",
    },
    {
      quote: "Finally, a solution that scales with our team. We went from manual screenshot hell to automated perfection in just one week.",
      author: "David Kim",
      role: "Engineering Manager",
      company: "ScaleUp Solutions",
      avatar: "DK",
    },
    {
      quote: "The ROI was immediate. We reduced documentation maintenance time by 80% and improved our user onboarding experience significantly.",
      author: "Lisa Thompson",
      role: "VP of Customer Success",
      company: "UserFirst",
      avatar: "LT",
    },
    {
      quote: "DocShot AI's enterprise features give us the security and control we need. The team collaboration tools are excellent.",
      author: "James Miller",
      role: "CTO",
      company: "SecureTech",
      avatar: "JM",
    },
  ];

  const stats = [
    { value: "500+", label: "Teams using DocShot AI" },
    { value: "10,000+", label: "Screenshots automated" },
    { value: "80%", label: "Time saved on docs" },
    { value: "99.9%", label: "Uptime guarantee" },
  ];

  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Trusted by teams worldwide
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            What our customers say
          </h3>
          <p className="text-lg text-gray-600">
            Join hundreds of teams who have transformed their documentation workflow
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                </div>
              </div>
              <blockquote className="text-gray-700 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Customer logos */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500 mb-8">
            Join teams from these companies and more
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {[
              'Stripe', 'GitHub', 'Vercel', 'Linear', 'Notion', 
              'Figma', 'Slack', 'Discord', 'Shopify', 'Atlassian'
            ].map((company) => (
              <div key={company} className="text-gray-400 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 sm:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to transform your documentation workflow?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have already automated their screenshot management. 
              Start your free trial today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
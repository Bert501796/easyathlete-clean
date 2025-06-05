import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-left">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p><strong>Effective Date:</strong> June 5, 2025</p>
      <p><strong>Contact Email:</strong> bverschoren@gmail.com</p>

      <h2 className="text-xl font-semibold mt-6">1. Service Description</h2>
      <p>
        EasyAthlete offers personalized fitness insights and training plans based on
        user activity data and performance.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. Eligibility</h2>
      <p>
        The app is only available to EU residents aged 16 or older.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Usage</h2>
      <ul className="list-disc ml-6">
        <li>No account sharing</li>
        <li>No abuse or misuse of the platform</li>
        <li>Violations may result in suspension</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">4. Payments</h2>
      <p>
        Fitness insights are free. Training schedules may become a paid feature later.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Service Availability</h2>
      <p>
        While we back up data daily, EasyAthlete cannot guarantee uptime or immunity
        from data loss. Use at your own risk.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Data Processing</h2>
      <p>
        Your Strava data is processed only with your consent. We comply with Strava's API rules
        and do not compete with or replicate their service.
      </p>

      <h2 className="text-xl font-semibold mt-6">7. Governing Law</h2>
      <p>This agreement is governed by the laws of the European Union.</p>
    </div>
  );
};

export default TermsOfService;

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-left">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p><strong>Effective Date:</strong> June 5, 2025</p>
      <p><strong>Contact Email:</strong> bverschoren@gmail.com</p>

      <h2 className="text-xl font-semibold mt-6">1. Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li>Email address</li>
        <li>First name</li>
        <li>Fitness data from Strava (e.g., heart rate, pace, activity type)</li>
        <li>Location data from Strava activities</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">2. How We Use Your Data</h2>
      <p>
        We use your data to provide personalized fitness insights, generate training plans,
        and improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Data Sharing</h2>
      <p>
        We do not sell your data. We use anonymized data with OpenAI to generate schedules.
        Strava provides activity data, and MongoDB Atlas (EU) stores it securely.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Data Deletion</h2>
      <p>
        Users can delete their account at any time. All data will be removed from MongoDB.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Data Storage</h2>
      <p>All data is stored in MongoDB Atlas in the EU.</p>

      <h2 className="text-xl font-semibold mt-6">6. Age Requirement</h2>
      <p>Only users aged 16 or older are allowed to use EasyAthlete.</p>

      <h2 className="text-xl font-semibold mt-6">7. EU User Policy</h2>
      <p>Our service is currently only available to users within the European Union.</p>
    </div>
  );
};

export default PrivacyPolicy;

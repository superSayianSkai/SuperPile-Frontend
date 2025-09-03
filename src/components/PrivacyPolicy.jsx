const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto dark:text-white    p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-6">
        <strong>Supapile</strong> respects your privacy. This Privacy Policy
        explains what data is collected, how it is used, and how it is
        protected.
      </p>

      <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-6">
        <li>
          <strong>URLs you submit via the extension:</strong> The extension
          sends URLs you provide to our main website (www.supapile.com) for
          storage and management.
        </li>
        <li>
          <strong>Usage data:</strong> We may collect anonymous usage data
          through Google Analytics (GA4) to improve the extension and website
          functionality, such as feature usage, frequency of use, and errors.
        </li>
      </ul>
      <p className="italic mb-6">
        Note: The extension itself does not store any URLs or personal data
        locally.
      </p>

      <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Data</h2>
      <ul className="list-disc list-inside mb-6">
        <li>
          To provide the core service of saving and organizing URLs on our
          website.
        </li>
        <li>
          To improve the extension and website performance through anonymous
          analytics.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">3. Sharing Your Data</h2>
      <ul className="list-disc list-inside mb-6">
        <li>
          We do not sell or share your submitted URLs or personal data with
          third parties.
        </li>
        <li>
          Usage data sent to Google Analytics is anonymous and cannot personally
          identify you.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
      <p className="mb-6">
        All URLs submitted through the extension are stored securely on our
        website. We implement reasonable security measures to protect your data.
      </p>

      <h2 className="text-2xl font-semibold mb-3">5. Your Choices</h2>
      <ul className="list-disc list-inside mb-6">
        <li>You can delete URLs via your account on our website.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy or how we handle your
        data, please contact us at:{" "}
        <strong>siliconsynergy2024@gmail.com</strong>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Terms of Service",
  subtitle: "Rules for using the Data Captain API, dashboard, and related services.",
  lastUpdated: "11 June 2026",
  sections: [
    {
      id: "agreement",
      title: "1. Agreement",
      paragraphs: [
        'These Terms of Service ("Terms") govern your access to and use of the Data Captain website, developer dashboard, REST APIs, WebSocket feeds, documentation, and subscription services (collectively, the "Service") operated by Data Captain ("we", "us", or "our").',
        "By creating an account, generating an API key, or using the Service in any way, you agree to these Terms. If you use the Service on behalf of a company, you represent that you have authority to bind that company.",
      ],
    },
    {
      id: "service",
      title: "2. The Service",
      paragraphs: [
        "Data Captain provides programmatic access to US stock and ETF market data, including prices, historical series, ETFs, and related datasets as described in our API documentation.",
        "We may add, change, or retire endpoints, fields, rate limits, or plan features. Material changes will be communicated via the dashboard, email, or documentation where practicable.",
      ],
      bullets: [
        "API access requires a valid account and API key.",
        "Usage is subject to daily request limits based on your subscription plan.",
        "Free and paid tiers may differ in which endpoints are available.",
      ],
    },
    {
      id: "accounts",
      title: "3. Accounts & API keys",
      paragraphs: [
        "You must provide accurate registration information and keep your credentials secure. You are responsible for all activity under your account and API keys.",
        "Do not share API keys in public repositories, client-side code, or unsecured channels. Rotate keys promptly if you suspect compromise.",
      ],
      bullets: [
        "One person or legal entity per account unless we approve otherwise.",
        "You must be at least 18 years old (or the age of majority in your jurisdiction).",
        "We may suspend accounts that violate these Terms or pose security risk.",
      ],
    },
    {
      id: "acceptable-use",
      title: "4. Acceptable use",
      paragraphs: [
        "You may use the Service only for lawful purposes and in accordance with these Terms and applicable law.",
      ],
      bullets: [
        "No scraping or reselling the Service in a way that competes with Data Captain without written permission.",
        "No attempts to bypass rate limits, authentication, or plan restrictions.",
        "No reverse engineering of proprietary systems except where permitted by law.",
        "No use that disrupts or degrades the Service for other customers.",
        "No unlawful, fraudulent, or harmful activity.",
      ],
    },
    {
      id: "market-data",
      title: "5. Market data disclaimer",
      paragraphs: [
        "Market data is provided for informational and development purposes. Data Captain is not a registered investment adviser, broker-dealer, or financial institution.",
        "Data may be delayed, incomplete, or contain errors. You must not rely on the Service as the sole basis for investment or trading decisions. Verify critical data with official sources before use in production trading systems.",
        "You are responsible for complying with any third-party or exchange redistribution requirements that apply to your use of market data.",
      ],
    },
    {
      id: "billing",
      title: "6. Subscriptions & billing",
      paragraphs: [
        "Paid plans are billed in Indian Rupees (INR) through Razorpay unless otherwise stated. Prices and request limits are shown on our pricing page and in your dashboard.",
        "Subscriptions renew automatically each billing period until cancelled. You may cancel from the billing section of your dashboard; access to paid features typically continues until the end of the current paid period.",
        "Refunds are handled in line with applicable consumer law and our refund policy stated at checkout. Failed payments may result in downgrade to the free tier.",
      ],
    },
    {
      id: "ip",
      title: "7. Intellectual property",
      paragraphs: [
        "We own the Service, including software, branding, documentation, and site content. You receive a limited, non-exclusive, non-transferable licence to use the Service according to your plan while your account is in good standing.",
        "You retain ownership of your applications and content. You grant us a licence to process usage logs and account data as needed to operate and improve the Service.",
      ],
    },
    {
      id: "availability",
      title: "8. Availability & support",
      paragraphs: [
        'The Service is provided on an "as is" and "as available" basis. We strive for high uptime but do not guarantee uninterrupted access.',
        "Support channels and response times vary by plan. Enterprise or custom arrangements may be agreed separately in writing.",
      ],
    },
    {
      id: "liability",
      title: "9. Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, Data Captain and its affiliates will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or business opportunities arising from your use of the Service.",
        "Our total liability for any claim relating to the Service is limited to the amount you paid us in the twelve (12) months before the event giving rise to the claim, or INR 5,000 if you are on a free plan.",
      ],
    },
    {
      id: "termination",
      title: "10. Termination",
      paragraphs: [
        "You may stop using the Service at any time. We may suspend or terminate access if you breach these Terms, fail to pay, or if required by law.",
        "Upon termination, your right to use the Service ends. Provisions that by nature should survive (including disclaimers, liability limits, and governing law) will survive.",
      ],
    },
    {
      id: "law",
      title: "11. Governing law",
      paragraphs: [
        "These Terms are governed by the laws of India, without regard to conflict-of-law principles. Courts in Bengaluru, Karnataka shall have exclusive jurisdiction, subject to mandatory consumer protections in your country of residence where applicable.",
      ],
    },
    {
      id: "contact",
      title: "12. Contact",
      paragraphs: [
        "Questions about these Terms: legal@datacaptain.com",
        "Billing or account support: use the Support section in your dashboard or sales@datacaptain.com.",
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  subtitle: "How Data Captain collects, uses, and protects your information.",
  lastUpdated: "11 June 2026",
  sections: [
    {
      id: "overview",
      title: "1. Overview",
      paragraphs: [
        'Data Captain ("we", "us") respects your privacy. This Privacy Policy explains what personal data we collect when you use our website, dashboard, and APIs, how we use it, and your choices.',
        "By using the Service, you consent to the practices described here. If you do not agree, please do not use the Service.",
      ],
    },
    {
      id: "collect",
      title: "2. Information we collect",
      paragraphs: ["We collect information you provide and data generated through your use of the Service."],
      bullets: [
        "Account data: name, email address, password hash, and optional profile fields.",
        "Authentication: Google OAuth identifiers if you sign in with Google.",
        "Billing: subscription plan, payment status, and transaction references from Razorpay (we do not store full card numbers).",
        "API usage: endpoints called, timestamps, response codes, and API key identifiers (not the secret key itself after initial display).",
        "Technical data: IP address, browser type, device information, and cookies for session and security.",
        "Communications: messages you send to support.",
      ],
    },
    {
      id: "use",
      title: "3. How we use information",
      paragraphs: ["We use your information to operate and improve the Service."],
      bullets: [
        "Authenticate you and provide API access.",
        "Enforce plan limits, prevent abuse, and secure accounts.",
        "Process subscriptions and send billing-related notices.",
        "Respond to support requests.",
        "Analyse aggregated usage to improve performance and features.",
        "Comply with legal obligations and protect our rights.",
      ],
    },
    {
      id: "sharing",
      title: "4. When we share information",
      paragraphs: [
        "We do not sell your personal information. We may share data only in these circumstances:",
      ],
      bullets: [
        "Service providers: hosting (e.g. Railway, Vercel), payment processing (Razorpay), email, and analytics — under contracts that limit use to providing services to us.",
        "Legal requirements: when required by law, court order, or to protect safety and rights.",
        "Business transfers: in connection with a merger, acquisition, or sale of assets, with notice where required.",
      ],
    },
    {
      id: "retention",
      title: "5. Data retention",
      paragraphs: [
        "We retain account and billing records while your account is active and for a reasonable period afterward for legal, tax, and dispute resolution purposes.",
        "API usage logs are retained for operational and billing analysis; retention periods may vary by log type.",
        "You may request deletion of your account subject to legal retention requirements.",
      ],
    },
    {
      id: "security",
      title: "6. Security",
      paragraphs: [
        "We use industry-standard measures including encryption in transit (HTTPS), hashed credentials, and access controls for production systems.",
        "No method of transmission or storage is 100% secure. You are responsible for safeguarding your API keys and account password.",
      ],
    },
    {
      id: "rights",
      title: "7. Your rights",
      paragraphs: [
        "Depending on your location, you may have rights to access, correct, delete, or export your personal data, and to object to or restrict certain processing.",
        "Indian users may have rights under applicable law including the Digital Personal Data Protection Act where it applies.",
        "To exercise rights, contact privacy@datacaptain.com. We may verify your identity before responding.",
      ],
    },
    {
      id: "cookies",
      title: "8. Cookies & similar technologies",
      paragraphs: [
        "We use essential cookies and local storage for authentication (e.g. session tokens) and preferences.",
        "We may use analytics to understand how the marketing site is used. You can control non-essential cookies through your browser settings.",
      ],
    },
    {
      id: "children",
      title: "9. Children",
      paragraphs: [
        "The Service is not directed to children under 18. We do not knowingly collect personal data from children. Contact us if you believe a child has provided data.",
      ],
    },
    {
      id: "international",
      title: "10. International transfers",
      paragraphs: [
        "Our infrastructure may process data in India and other countries where our providers operate. We take steps to ensure appropriate safeguards when data crosses borders.",
      ],
    },
    {
      id: "changes",
      title: "11. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. We will post the revised version on this page and update the \"Last updated\" date. Material changes may be notified by email or dashboard notice.",
      ],
    },
    {
      id: "contact",
      title: "12. Contact",
      paragraphs: [
        "Privacy questions or requests: privacy@datacaptain.com",
        "Data Captain — datacaptain.in",
      ],
    },
  ],
};

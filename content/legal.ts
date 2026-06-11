/**
 * Plain-content source for the legal pages. These are standard, good-faith
 * templates for a free browser-based calculator tool — they should be reviewed
 * by qualified counsel before launch.
 */

export interface LegalSection {
  heading: string;
  body?: string[];
  list?: string[];
}

export interface LegalDoc {
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const UPDATED = "June 12, 2026";
const SITE = "Online Calculator.tools";

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  description:
    "How Online Calculator.tools handles your data: what we collect, how calculations are processed in your browser, our use of cookies and analytics, and your rights.",
  updated: UPDATED,
  intro: `This Privacy Policy explains how ${SITE} ("we", "us") handles information when you use our website and calculators. Our guiding principle is simple: we collect as little as possible, and the numbers you enter into a calculator stay in your browser.`,
  sections: [
    {
      heading: "Information we collect",
      body: [
        "We are designed to work without accounts or personal information. The limited data we may handle falls into three groups:",
      ],
      list: [
        "Calculator inputs: the values you type are processed in your browser to produce results. They are not transmitted to or stored on our servers.",
        "Contact submissions: if you use our contact form, we receive the name, email, subject and message you provide so we can respond.",
        "Usage data: like most websites, our hosting and analytics may record anonymised technical information such as page views, device type and approximate region.",
      ],
    },
    {
      heading: "How calculations are processed",
      body: [
        "Our calculators run client-side. When you enter figures — for example a loan amount or your weight — the math executes locally in your browser and the result is shown to you directly. We do not need, request, or retain those values.",
        "Share links encode your inputs into the page URL so you can bookmark or send a calculation. That URL is only shared if you choose to share it.",
      ],
    },
    {
      heading: "How we use information",
      body: [
        "We use contact form details solely to reply to your message. We use anonymised usage data to understand which calculators are popular, fix problems, and improve performance. We do not use your data for profiling or to build advertising profiles about you.",
      ],
    },
    {
      heading: "Cookies and analytics",
      body: [
        "We use a small amount of browser storage to remember preferences such as your light/dark theme. We may use privacy-respecting analytics to measure aggregate traffic. For details and choices, see our Cookie Policy.",
      ],
    },
    {
      heading: "Sharing and disclosure",
      body: [
        "We do not sell your personal information. We may share limited data with service providers who help us operate the site (such as hosting and analytics providers), and we may disclose information where required by law.",
      ],
    },
    {
      heading: "Data retention",
      body: [
        "Contact submissions are kept only as long as needed to handle your request and for reasonable record-keeping. Anonymised usage data may be retained in aggregate. Because calculator inputs are not collected, there is nothing for us to retain.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Depending on your location, you may have rights to access, correct or delete the personal data we hold about you (which, for most visitors, is none). To make a request, contact us using the details below.",
      ],
    },
    {
      heading: "Children's privacy",
      body: [
        "Our tools are general-purpose and not directed at children under 13. We do not knowingly collect personal information from children.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "We may update this Privacy Policy from time to time. Material changes will be reflected by updating the date at the top of this page.",
      ],
    },
    {
      heading: "Contact us",
      body: [
        "If you have questions about this policy or your data, please reach out through our Contact page.",
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms of Service",
  description:
    "The terms governing your use of Online Calculator.tools, including acceptable use, the no-professional-advice disclaimer, and limitations of liability.",
  updated: UPDATED,
  intro: `These Terms of Service govern your access to and use of ${SITE}. By using the site, you agree to these terms. If you do not agree, please do not use the site.`,
  sections: [
    {
      heading: "Acceptance of terms",
      body: [
        "By accessing or using our calculators and website, you confirm that you can form a binding contract and that you accept these terms and our Privacy Policy.",
      ],
    },
    {
      heading: "Use of the service",
      body: ["You may use the calculators freely for personal and commercial purposes. You agree not to:"],
      list: [
        "misuse the service or attempt to disrupt, overload, or reverse-engineer it;",
        "use automated means to scrape or copy the site at scale without permission;",
        "use the site for any unlawful purpose or in violation of these terms.",
      ],
    },
    {
      heading: "No professional advice",
      body: [
        "The calculators and content are provided for general informational and educational purposes only. They are not financial, investment, tax, legal, medical or other professional advice.",
        "Results are estimates based on the inputs you provide and standard formulas; they may not reflect your individual circumstances. Always consult a qualified professional before making financial or health decisions.",
      ],
    },
    {
      heading: "Accuracy and availability",
      body: [
        'The service is provided "as is" and "as available". While we work hard to ensure our formulas and results are accurate, we do not warrant that the site will be uninterrupted, error-free, or that any result is suitable for a particular purpose.',
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The site design, text, and software are owned by us or our licensors and are protected by applicable laws. You may not copy or redistribute substantial portions of the site without permission.",
      ],
    },
    {
      heading: "Third-party links and advertising",
      body: [
        "The site may contain links to third-party websites or display advertising. We are not responsible for the content, products, or practices of third parties.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the maximum extent permitted by law, we will not be liable for any indirect, incidental, or consequential damages, or for any loss arising from reliance on a calculation or content provided by the site.",
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may revise these terms at any time. Continued use of the site after changes take effect constitutes acceptance of the revised terms.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of the jurisdiction in which the site operator is established, without regard to conflict-of-law principles.",
      ],
    },
    {
      heading: "Contact us",
      body: [
        "Questions about these terms can be sent through our Contact page.",
      ],
    },
  ],
};

export const cookiePolicy: LegalDoc = {
  title: "Cookie Policy",
  description:
    "How Online Calculator.tools uses cookies and browser storage, the categories involved, and how you can manage your preferences.",
  updated: UPDATED,
  intro: `This Cookie Policy explains how ${SITE} uses cookies and similar browser storage technologies, and the choices available to you.`,
  sections: [
    {
      heading: "What are cookies?",
      body: [
        "Cookies are small text files stored on your device by your browser. Similar technologies, such as local storage, let a site remember information between visits. We use a minimal set of these to make the site work and to remember your preferences.",
      ],
    },
    {
      heading: "How we use them",
      body: ["We keep our use of cookies and storage deliberately small:"],
      list: [
        "Preferences: we store your light/dark theme choice in your browser's local storage so the site remembers it.",
        "Analytics: we may use privacy-respecting analytics cookies to measure aggregate, anonymised traffic and improve the site.",
        "Essential: some storage may be required for core functionality and security.",
      ],
    },
    {
      heading: "Categories of cookies",
      body: [
        "Essential cookies are necessary for the site to function and cannot be switched off in our systems. Preference cookies remember choices like your theme. Analytics cookies help us understand how visitors use the site in aggregate.",
      ],
    },
    {
      heading: "Managing your preferences",
      body: [
        "You can control and delete cookies and local storage through your browser settings. Blocking some types may affect how the site works — for example, your theme preference may not be remembered between visits.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "We may update this Cookie Policy as our practices evolve. The date at the top of this page shows when it was last revised.",
      ],
    },
    {
      heading: "Contact us",
      body: [
        "If you have questions about our use of cookies, please reach out via our Contact page.",
      ],
    },
  ],
};

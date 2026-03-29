import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Notice | Calendly',
  description: 'Read Calendly’s Privacy Notice to learn how we collect, store, and use your personal data.',
};

export default function PrivacyNoticePage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Notice</h1>
      <p className="text-gray-500 mb-8">Effective Date: October 17, 2025</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction.</h2>
          <p className="mb-4">
            This privacy notice (“Privacy Notice”) describes how Calendly, LLC (“Calendly”, “we”,“us”, “our”) collects, uses, and discloses your Personal Data in the course of our business. Throughout this document, we will use a few defined terms.
          </p>
          <p className="mb-4">
            “Personal Data” when used in this Privacy Notice means any data relating to an identified or identifiable natural person that is processed by Calendly as described in this Privacy Notice when such information is protected as “personal data” or “personal information” or a similar term under applicable data protection laws.
          </p>
          <p className="mb-4">
            “Services” when used in this Privacy Notice means all of Calendly’s websites, applications (including, but not limited to, mobile and cloud applications), tools, platforms, and services offered by Calendly, but excluding third party applications.
          </p>
          <p className="mb-4">
            “Website” when used in this Privacy Notice means the Calendly.com website or any other proprietary website owned by Calendly or that Calendly has the authority to manage and control and which link to this Privacy Notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Applicability.</h2>
          <p className="mb-4">
            Unless stated otherwise, this Privacy Notice only applies to Personal Data for which Calendly acts as a controller, such as when you visit our Website or create an account for our Services. Please note that when our customers use our Services to directly collect and process Personal Data, such as when our customers use our Services to schedule a meeting with you or record a meeting, Calendly acts as a processor (or service provider) on behalf of our customers (who are controllers of the Personal Data) under the Calendly Data Processing Addendum and Customer Terms and Conditions.
          </p>
          <p className="mb-4">
            If you have questions about how your data is processed by our customers or wish to exercise your rights with respect to that data, you should contact the customer which collected your information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information You Provide Directly to Calendly</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>When You Visit Our Website.</strong> We may collect Personal Data from you when you submit information via a web form or otherwise interact with our Website, for example to request a demo, create a help center or developer account, or download resources and white papers. In these instances, we may ask for certain Personal Data, such as your name, email address, and phone number.
            </li>
            <li>
              <strong>Account Information.</strong> Calendly’s customers provide Calendly with Personal Data, including name, email address, username, and password, when they set up their account. If a customer has multiple account holders, then each account holder will provide us with similar information.
            </li>
            <li>
              <strong>Billing Information.</strong> If you purchase a paid version of Calendly, our third party payment processors will collect and store your billing address and credit card information. We store the last four digits of your credit card number, card type, and the expiration date.
            </li>
            <li>
              <strong>Marketing Information.</strong> People interested in Calendly’s products and services may contact us through forms made available on the Website and voluntarily provide information such as name, email address, phone number, company, and role.
            </li>
            <li>
              <strong>Additional Information.</strong> We may also receive certain Personal Data as you interact with Calendly through activities such as surveys, focus groups, or any other product education initiatives aimed at receiving your feedback.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Collected Automatically From You.</h2>
          <p className="mb-4">
            We and our authorized third parties use Cookies, pixels, web beacons, and other technologies (such as local storage) to receive and store certain types of information when you interact with us through your computer or mobile device (subject to your consent, opt-out preferences or other appropriate legal basis where legally required). Using these technologies helps us customize your experience with our Website and Services, improve your experience, tailor marketing messages, and detect and prevent fraud and security risks.
          </p>
          <ul className="list-disc pl-5 space-y-3">
            <li>
              <strong>Log & Device Data.</strong> When you access the Website or the Services, we and our authorized third parties may automatically record certain information (“log data”), including information that your browser sends whenever you visit our Website. This log data may include information, such as the web address you came from or are going to, your device model, operating system, browser type, unique device identifier, IP address, mobile network carrier, and time zone or approximate location.
            </li>
            <li>
              <strong>Cookie and Local Storage Data.</strong> Depending on how you’re accessing our Services and subject to your consent, opt-out preferences, or other appropriate legal basis where legally required, we and our authorized third parties may use “Cookies” (a small text file sent by your computer each time you visit our Website, unique to your Calendly account or your browser) or similar technologies such as pixels, web beacons or local storage to record log data.
            </li>
            <li>
              <strong>Usage Data.</strong> When our customers use our Services, we and our authorized third parties collect certain information about how you use the Services. For example, we collect information on the meeting types our customers use most often, how many meetings are scheduled each day, the app used for the virtual meeting, and whether the meeting was recorded.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information from Third Party Sources</h2>
          <p className="mb-4">
            We may obtain Personal Data about you from third party sources. This Personal Data may include personal and employment information from lead-generation and marketing companies. For example, these third party sources may provide Calendly with name, email address, phone number, location of business, time zone, biographical details, job title, employer (and related company details), employment seniority, social media usernames and avatars, and social media activity details. Calendly uses this information to assist with its sales and marketing efforts.
          </p>
        </section>
      </div>
    </>
  );
}

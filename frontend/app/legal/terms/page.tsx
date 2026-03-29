import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Definitions | Calendly',
  description: 'Legal Definitions for Calendly',
};

export default function TermsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Definitions</h1>
      <p className="whitespace-pre-wrap">
        These capitalized terms referenced and used throughout (and not otherwise defined in) Calendly’s Terms shall have the following meanings:
      </p>
      
      <ol className="list-decimal pl-5 mt-6 space-y-4">
        <li>
          <strong>“Acceptable Use Policy” or “AUP”</strong> means Calendly’s Acceptable Use Policy.
        </li>
        <li>
          <strong>“Affiliate”</strong> means any Entity that directly or indirectly controls, is controlled by, or is under common control with a party, where control means at least 50% ownership or power to direct an Entity’s management.
        </li>
        <li>
          <strong>“Applicable Laws”</strong> means all applicable local, state, federal and international laws, regulations and conventions, including those related to data privacy and data transfer, the exportation of technical or personal data, and any applicable communications, wiretap and other laws pertaining to recording, transcribing and/or summarizing.
        </li>
        <li>
          <strong>“Authorized Users”</strong> means an Entity’s employees, consultants, contractors, and agents i) who are authorized by the Entity to access and use the Services under the rights granted to the Entity pursuant to the Customer Terms and Conditions or a Master Services Agreement; and ii) for whom access to the Services has been purchased thereunder. Authorized Users may include employees, consultants, contractors and agents of Customer or its Affiliates.
        </li>
        <li>
          <strong>"Calendly,” “we,” “our,” or “us”</strong> means Calendly, LLC and its Affiliates.
        </li>
        <li>
          <strong>“Calendly IP”</strong> means our service marks or trademarks in the form of words, graphics, and logos, the Website(s), Services, Documentation, Usage Information, Feedback, API, any and all related or and any modifications or derivative works of the foregoing.
        </li>
        <li>
          <strong>“Confidential Information”</strong> means information disclosed by or on behalf of one party (“Discloser”) to the other party (“Recipient”) under these Terms, in any form, concerning the Discloser’s business, including its operations, strategies, financial information, products, services, and customer information, which (a) Discloser identifies to Recipient as “confidential” or “proprietary”, either in writing or verbally or (b) should be reasonably understood as confidential or proprietary due to its nature or the circumstances of its disclosure.
        </li>
        <li>
          <strong>“Customer”</strong> means either i) an individual with a registered Calendly account; or ii) an Entity that has purchased Calendly licenses for its Authorized Users to access and use the Services with registered accounts through the Entity domain.
        </li>
        <li>
          <strong>“Customer Data”</strong> means information, data, and other content, in any form or medium, that is submitted, or posted by or on behalf of Customer, an Authorized User, or their Invitees through the Services. To be clear, Customer retains all Intellectual Property Rights in Customer Data.
        </li>
        <li>
          <strong>"Customer Terms” or “Customer Terms and Conditions”</strong> means the Calendly Customer Terms and Conditions.
        </li>
        <li>
          <strong>“Data Processing Addendum” or (“DPA”)</strong> means the data processing addendum.
        </li>
        <li>
          <strong>"Definitions”</strong> means this Calendly Definitions page.
        </li>
        <li>
          <strong>“Documentation”</strong> means information, policies and specifications related to the Services created by or on behalf of Calendly made available on Calendly’s Website or generally by Calendly in any format which includes but is not limited to user guides or manuals, user materials, service descriptions, help articles, or other end user documentation for the Services, including any derivatives.
        </li>
        <li>
          <strong>“Entity”</strong> means a company or organization which has purchased licenses to the Services for use with email domains it owns, controls or manages, or has authority to bind to Customer Terms and Conditions or an MSA and be responsible for individuals using such email domain(s) with the Services.
        </li>
      </ol>
      <div className="mt-8 text-sm text-gray-500">
        Effective Date: December 10, 2025
      </div>
    </>
  );
}

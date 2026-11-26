"use client";

import { FormEvent } from "react";
import { useState } from "react";

type EnquiryType = "investor" | "others";

// Extra details asked of investors. The keys are stored under the lead's
// `data` and shown in Admin > Leads, so keep them stable.
const INVESTOR_FIELDS = [
  { name: "project_undertaken_by", label: "Project undertaken by", placeholder: "Company name" },
  { name: "land_requirement", label: "Land", placeholder: "e.g. 25 acres" },
  { name: "water_requirement", label: "Water", placeholder: "e.g. 500 KLD" },
  { name: "electricity_requirement", label: "Electricity", placeholder: "e.g. 5 MW" },
] as const;

export default function ContactForm() {
  const [enquiryType, setEnquiryType] = useState<EnquiryType>("others");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const v = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value.trim();
    const apiKey = process.env.NEXT_PUBLIC_IKSEZ_PUBLISHABLE_KEY;
    const isInvestor = enquiryType === "investor";
    const investorDetails: Record<string, string> = {};
    if (isInvestor) for (const field of INVESTOR_FIELDS) investorDetails[field.name] = v(field.name);

    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey ?? "" },
        body: JSON.stringify({
          first_name: v("name"),
          email: v("email"),
          lead_source: isInvestor ? "Website contact form - Investor" : "Website contact form - Others",
          description: v("message"),
          data: { enquiry_type: enquiryType, subject: v("subject"), ...investorDetails },
        }),
      });
      const result = (await response.json()) as { is_success?: boolean; message?: string };

      if (!response.ok || result.is_success === false) {
        throw new Error(result.message || "We could not send your message. Please try again.");
      }

      form.reset();
      setEnquiryType("others");
      setFeedback({ type: "success", message: "Thank you. Your message has been sent successfully." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "We could not send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="form-grid" id="contact-form" noValidate onSubmit={handleSubmit}>
      <div className="form-head">
        <h2 className="contact-card__title">Send us a message</h2>
        <div className="choice-group" role="radiogroup" aria-labelledby="cf-type-label">
          <span className="choice-group__label" id="cf-type-label">
            I am an <span className="required" aria-hidden="true">*</span>
          </span>
          <div className="segmented">
            {(["investor", "others"] as const).map((type) => (
              <label className="segmented__option" key={type}>
                <input
                  type="radio"
                  name="enquiry_type"
                  value={type}
                  checked={enquiryType === type}
                  onChange={() => setEnquiryType(type)}
                />
                <span>{type === "investor" ? "Investor" : "Others"}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="form-row form-row--3">
        <div className="field">
          <label htmlFor="cf-name">
            Name <span className="required" aria-hidden="true">*</span>
          </label>
          <input type="text" id="cf-name" name="name" autoComplete="name" placeholder="Your full name" required />
        </div>
        <div className="field">
          <label htmlFor="cf-email">
            Email <span className="required" aria-hidden="true">*</span>
          </label>
          <input type="email" id="cf-email" name="email" autoComplete="email" placeholder="you@company.com" required />
        </div>
        <div className="field">
          <label htmlFor="cf-subject">
            Subject <span className="required" aria-hidden="true">*</span>
          </label>
          <input type="text" id="cf-subject" name="subject" placeholder="How can we help?" required />
        </div>
      </div>
      {enquiryType === "investor" && (
        <fieldset className="form-group">
          <legend>Project requirements</legend>
          <div className="form-row form-row--4">
            {INVESTOR_FIELDS.map((field) => (
              <div className="field" key={field.name}>
                <label htmlFor={`cf-${field.name}`}>
                  {field.label} <span className="required" aria-hidden="true">*</span>
                </label>
                <input type="text" id={`cf-${field.name}`} name={field.name} placeholder={field.placeholder} required />
              </div>
            ))}
          </div>
        </fieldset>
      )}
      <div className="field">
        <label htmlFor="cf-message">
          Message <span className="required" aria-hidden="true">*</span>
        </label>
        <textarea id="cf-message" name="message" placeholder="Tell us about your requirement..." required></textarea>
      </div>
      <div>
        <button className="btn btn--brand btn--lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Send message
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4 20-7z" />
              </svg>
            </>
          )}
        </button>
      </div>
      {feedback && (
        <p
          className={feedback.type === "success" ? "form-feedback form-feedback--success" : "form-feedback form-feedback--error"}
          role="status"
          aria-live="polite"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {feedback.type === "success" ? (
              <path d="M20 6 9 17l-5-5" />
            ) : (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </>
            )}
          </svg>
          {feedback.message}
        </p>
      )}
    </form>
  );
}

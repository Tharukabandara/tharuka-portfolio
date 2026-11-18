export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // Honeypot field (should remain empty)
};

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactPayload(input: Partial<ContactPayload>): {
  valid: boolean;
  data: ContactPayload;
  errors: ContactFieldErrors;
} {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const subject = (input.subject ?? "").trim();
  const message = (input.message ?? "").trim();
  const website = (input.website ?? "").trim();

  const errors: ContactFieldErrors = {};

  if (name.length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  } else if (name.length > 80) {
    errors.name = "Name must be 80 characters or fewer.";
  }

  if (!EMAIL_REGEX.test(email) || email.length > 120) {
    errors.email = "Please enter a valid email address.";
  }

  if (subject.length < 3) {
    errors.subject = "Please provide a brief subject (at least 3 characters).";
  } else if (subject.length > 120) {
    errors.subject = "Subject must be 120 characters or fewer.";
  }

  if (message.length < 15) {
    errors.message = "Please enter a message of at least 15 characters.";
  } else if (message.length > 3000) {
    errors.message = "Message must be 3,000 characters or fewer.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    data: { name, email, subject, message, website },
    errors,
  };
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

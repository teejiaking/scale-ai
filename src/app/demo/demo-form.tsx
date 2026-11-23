"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, CircleCheck } from "lucide-react";
import { buttonClasses } from "@/components/button";
import { PRODUCTS } from "@/content/site";
import { cn } from "@/lib/cn";

type FieldName = "firstName" | "lastName" | "email" | "company" | "interest";
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["firstName", "lastName", "email", "company", "interest"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: FormData): Errors {
  const value = (name: string) => String(data.get(name) ?? "").trim();
  const errors: Errors = {};
  if (!value("firstName")) errors.firstName = "Enter your first name.";
  if (!value("lastName")) errors.lastName = "Enter your last name.";
  const email = value("email");
  if (!email) errors.email = "Enter your work email.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address, like name@company.com.";
  if (!value("company")) errors.company = "Enter your company or organization.";
  if (!value("interest")) errors.interest = "Choose what you'd like to discuss.";
  return errors;
}

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 text-[15px] text-ink transition-colors placeholder:text-ink/35 hover:border-ink/30 aria-[invalid=true]:border-red-600";

function Field({
  name,
  label,
  optional,
  error,
  children,
}: {
  name: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-ink/60">Optional</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function DemoForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const shouldReset = useRef(false);

  // The page stays mounted (hidden) after navigating away; don't greet the next visit
  // with a stale confirmation.
  useLayoutEffect(() => {
    return () => {
      if (shouldReset.current) {
        shouldReset.current = false;
        setSubmittedName(null);
        setErrors({});
      }
    };
  }, []);

  useEffect(() => {
    if (submittedName) successRef.current?.focus();
  }, [submittedName]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = validate(data);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Concept build: nothing is sent. Wire this to your CRM or email service to go live.
    setSubmittedName(String(data.get("firstName")).trim());
    shouldReset.current = true;
    form.reset();
  };

  const clearError = (name: string) => {
    if (!(name in errors)) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[name as FieldName];
      return next;
    });
  };

  if (submittedName) {
    return (
      <div className="flex min-h-[28rem] flex-col items-start justify-center">
        <CircleCheck className="size-10 text-emerald-600" aria-hidden />
        <h2 ref={successRef} tabIndex={-1} className="mt-6 text-3xl tracking-[-0.02em] outline-none">
          Thanks, {submittedName}.
        </h2>
        <p className="mt-3 max-w-md text-ink/65">
          In a live deployment, this request would go straight to our team. This concept build
          doesn&apos;t send or store form data.
        </p>
        <button
          type="button"
          onClick={() => {
            shouldReset.current = false;
            setSubmittedName(null);
          }}
          className={cn(buttonClasses({ variant: "soft", size: "sm" }), "mt-8")}
        >
          Send another request
        </button>
      </div>
    );
  }

  const describedBy = (name: FieldName) => (errors[name] ? `${name}-error` : undefined);

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onChange={(event) => {
        const field = event.target as EventTarget;
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement ||
          field instanceof HTMLTextAreaElement
        ) {
          clearError(field.name);
        }
      }}
      aria-label="Book a demo"
      className="space-y-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field name="firstName" label="First name" error={errors.firstName}>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            maxLength={80}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy("firstName")}
            className={cn(inputClasses, "h-12")}
          />
        </Field>
        <Field name="lastName" label="Last name" error={errors.lastName}>
          <input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            maxLength={80}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy("lastName")}
            className={cn(inputClasses, "h-12")}
          />
        </Field>
      </div>

      <Field name="email" label="Work email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          placeholder="name@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
          className={cn(inputClasses, "h-12")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field name="company" label="Company" error={errors.company}>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            maxLength={120}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
            className={cn(inputClasses, "h-12")}
          />
        </Field>
        <Field name="jobTitle" label="Job title" optional>
          <input
            id="jobTitle"
            name="jobTitle"
            autoComplete="organization-title"
            maxLength={120}
            className={cn(inputClasses, "h-12")}
          />
        </Field>
      </div>

      <Field name="interest" label="What would you like to discuss?" error={errors.interest}>
        <div className="relative">
          <select
            id="interest"
            name="interest"
            defaultValue=""
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={describedBy("interest")}
            className={cn(inputClasses, "h-12 appearance-none pr-10")}
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {PRODUCTS.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
            <option value="not-sure">Not sure yet</option>
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink/50"
          />
        </div>
      </Field>

      <Field name="message" label="Anything else we should know?" optional>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className={cn(inputClasses, "resize-y py-3")}
        />
      </Field>

      <button type="submit" className={cn(buttonClasses({ variant: "primary", size: "md" }), "w-full")}>
        Request a demo
      </button>
      <p className="text-center text-xs text-ink/60">
        Concept build: form data is validated in your browser and never sent anywhere.
      </p>
    </form>
  );
}

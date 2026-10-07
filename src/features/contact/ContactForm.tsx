"use client";

import { useActionState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";
import { sendMessage } from "@/lib/contact/actions";
import { initialContactState } from "@/lib/contact/schema";
import type { Contact } from "@/lib/content";

type ContactFormProps = { form: Contact["form"]; states: Contact["states"] };

function Field({ id, label, invalid, children }: { id: string; label: string; invalid: boolean; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute top-4 left-4 origin-left text-(color:--tone-muted) transition-all duration-(--dur-ui) ease-(--ease-glide)",
          "peer-focus:top-2 peer-focus:scale-[0.78] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-[0.78]",
          invalid && "text-(color:--c-rec)",
        )}
      >
        {label}
      </label>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-4 h-0.5 w-[calc(100%-2rem)] origin-left scale-x-0 bg-(color:--tone-accent) transition-transform duration-(--dur-ui) ease-(--ease-glide) peer-focus:scale-x-100"
      />
    </div>
  );
}

const inputClass =
  "peer w-full rounded-xl border bg-transparent px-4 pt-6 pb-2 text-[1.02rem] outline-none transition-colors placeholder-transparent focus:border-(color:--tone-accent)";

function Chips({ name, legend, optional, options }: { name: string; legend: string; optional: string; options: string[] }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 font-mono text-xs tracking-[0.14em] text-(color:--tone-muted) uppercase">
        {legend} <span className="opacity-60">· {optional}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <span key={option}>
            <input id={`${name}-${option}`} type="radio" name={name} value={option} className="peer sr-only" />
            <label
              htmlFor={`${name}-${option}`}
              className="inline-flex h-10 cursor-pointer items-center rounded-full border border-(color:--tone-line) px-4 text-[0.92rem] transition-colors duration-(--dur-ui) peer-checked:border-(color:--tone-accent) peer-checked:bg-(color:--tone-accent) peer-checked:text-(color:--c-ink) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(color:--c-signal) hover:border-(color:--tone-accent)"
            >
              {option}
            </label>
          </span>
        ))}
      </div>
    </fieldset>
  );
}

/** The contact form. Validates on the server, keeps the visitor's text if something fails, and says exactly what happened. */
export function ContactForm({ form, states }: ContactFormProps) {
  const [state, action, pending] = useActionState(sendMessage, initialContactState);
  const startedAt = useRef<HTMLInputElement>(null);
  const invalid = state.status === "invalid" ? state.fields : [];

  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div role="status" className="flex min-h-80 flex-col items-start justify-center gap-5 rounded-(--radius-lg) border border-(color:--tone-accent) p-8 md:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-(color:--tone-accent) text-(color:--c-ink)">
          <Check size={28} />
        </span>
        <p className="reframe text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] font-bold text-balance" style={{ "--wdth": 108 } as CSSProperties}>
          {states.success}
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="name" label={form.nameLabel} invalid={invalid.includes("name")}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder=" "
            aria-invalid={invalid.includes("name")}
            className={cn(inputClass, invalid.includes("name") ? "border-(color:--c-rec)" : "border-(color:--tone-line)")}
          />
        </Field>
        <Field id="email" label={form.emailLabel} invalid={invalid.includes("email")}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder=" "
            aria-invalid={invalid.includes("email")}
            className={cn(inputClass, invalid.includes("email") ? "border-(color:--c-rec)" : "border-(color:--tone-line)")}
          />
        </Field>
      </div>

      <Chips name="projectType" legend={form.projectTypeLabel} optional={form.optionalLabel} options={form.projectTypes} />
      <Chips name="budget" legend={form.budgetLabel} optional={form.optionalLabel} options={form.budgets} />

      <Field id="message" label={form.messageLabel} invalid={invalid.includes("message")}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder=" "
          aria-describedby="message-hint"
          aria-invalid={invalid.includes("message")}
          className={cn(inputClass, "min-h-40 resize-y", invalid.includes("message") ? "border-(color:--c-rec)" : "border-(color:--tone-line)")}
        />
      </Field>
      <p id="message-hint" className="-mt-3 text-[0.88rem] text-(color:--tone-muted)">
        {form.messagePlaceholder}
      </p>

      {/* Honeypot and timing: invisible to people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="" />

      <div className="flex flex-wrap items-center gap-5">
        <Button type="submit" size="lg" disabled={pending} icon={<Check size={18} />}>
          {pending ? form.sendingLabel : form.submitLabel}
        </Button>
        {state.status === "failure" || state.status === "invalid" ? (
          <p role="alert" className="max-w-[40ch] text-[0.95rem] text-(color:--c-rec)">
            {state.status === "failure" ? states.failure : states.invalid}
          </p>
        ) : null}
      </div>
    </form>
  );
}

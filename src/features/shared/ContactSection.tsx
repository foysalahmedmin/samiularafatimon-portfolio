import { ContactCredits } from "@/features/home/ContactCredits";
import { getHome, getSite, getUi } from "@/lib/content";

/** The closing call to action, identical on every page. */
export async function ContactSection() {
  const [site, home, ui] = await Promise.all([getSite(), getHome(), getUi()]);
  const whatsappHref = `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(site.contact.whatsapp.prefill)}`;
  return (
    <ContactCredits
      kicker={ui.bookCall}
      headline={home.contact.headline}
      sub={home.contact.sub}
      primary={home.contact.primaryCta}
      whatsapp={{ label: home.contact.whatsappLabel, href: whatsappHref }}
      email={{ label: home.contact.emailLabel, href: `mailto:${site.contact.email}` }}
      availability={site.availability}
      location={site.location}
    />
  );
}

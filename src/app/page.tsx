import type { Metadata } from "next";
import { AboutTeaser } from "@/features/home/AboutTeaser";
import { Boot } from "@/features/home/Boot";
import { CaseStack } from "@/features/home/CaseStack";
import { ContactCredits } from "@/features/home/ContactCredits";
import { FaqAccordion } from "@/features/home/FaqAccordion";
import { Hero } from "@/features/home/Hero";
import { ProcessScene } from "@/features/home/ProcessScene";
import { Proof } from "@/features/home/Proof";
import { Reel } from "@/features/home/Reel";
import { ServiceIndex } from "@/features/home/ServiceIndex";
import { Studio } from "@/features/home/Studio";
import { WorkTrack } from "@/features/home/WorkTrack";
import { Words } from "@/features/home/Words";
import {
  getAbout,
  getCaseStudies,
  getClients,
  getFaq,
  getHome,
  getPlayable,
  getProcess,
  getRibbonFrames,
  getServices,
  getSite,
  getSeo,
  getStats,
  getTestimonials,
  getUi,
  getWorkItems,
  getWorkPage,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("home");
  return pageMetadata({ ...seo, path: "/", absoluteTitle: true });
}

export default async function HomePage() {
  const [site, home, about, allStats, clients, workItems, workPage, cases, services, stages, faq, testimonials, frames, ui] =
    await Promise.all([
      getSite(),
      getHome(),
      getAbout(),
      getStats(),
      getClients(),
      getWorkItems({ featuredOnly: true }),
      getWorkPage(),
      getCaseStudies(),
      getServices(),
      getProcess(),
      getFaq(),
      getTestimonials({ featuredOnly: true }),
      getRibbonFrames(14),
      getUi(),
    ]);
  const reel = await getPlayable(home.reel.media);
  if (reel.kind !== "video") throw new Error("The reel must be a video entry");

  const whatsappHref = `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(site.contact.whatsapp.prefill)}`;

  return (
    <>
      <Boot name={site.name} />
      <Hero
        name={site.name}
        kicker={home.hero.kicker}
        headline={home.hero.headline}
        sub={home.hero.sub}
        primary={home.hero.primaryCta}
        secondary={home.hero.secondaryCta}
        frames={frames}
      />
      <Proof
        head={home.proof}
        clientsLabel={home.proof.clientsLabel}
        stats={allStats.filter((stat) => stat.featured)}
        clients={clients}
      />
      <Reel
        head={home.reel}
        video={reel}
        caption={home.reel.caption}
        labels={{ play: ui.play, videoUnavailable: ui.videoUnavailable }}
      />
      <WorkTrack head={home.work} items={workItems} categories={workPage.categories} watchLabel={ui.watch} />
      <CaseStack head={home.cases} cases={cases} labels={{ readCase: ui.readCase, client: ui.caseStudy.client }} />
      <ServiceIndex head={home.services} services={services} />
      <ProcessScene head={home.process} stages={stages} />
      <AboutTeaser
        head={home.about}
        portrait={about.portrait}
        story={about.story[0] ?? ""}
        facts={about.facts}
      />
      <Words
        head={home.words}
        items={testimonials}
        labels={{ previous: ui.previous, next: ui.next, readCase: ui.readCase }}
      />
      <Studio
        head={home.studio}
        stats={allStats.filter((stat) => stat.scope === "agency")}
        serviceNames={services.map((service) => service.shortTitle)}
      />
      <FaqAccordion head={home.faq} items={faq.groups.flatMap((group) => group.items)} />
      <ContactCredits
        kicker={home.proof.kicker === "" ? "" : ui.bookCall}
        headline={home.contact.headline}
        sub={home.contact.sub}
        primary={home.contact.primaryCta}
        whatsapp={{ label: home.contact.whatsappLabel, href: whatsappHref }}
        email={{ label: home.contact.emailLabel, href: `mailto:${site.contact.email}` }}
        availability={site.availability}
        location={site.location}
      />
    </>
  );
}

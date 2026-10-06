import type { CaseStudy } from "../schema/collections";
import { fafaFitness } from "./fafa-fitness";
import { pathao } from "./pathao";
import { richFromAnywhere } from "./rich-from-anywhere";

/** Order here is the order shown on the site; each case's `next` forms a loop. */
export const caseStudies: CaseStudy[] = [pathao, richFromAnywhere, fafaFitness];

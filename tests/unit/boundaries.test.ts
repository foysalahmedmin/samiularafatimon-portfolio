import { describe, expect, it } from "vitest";
import { ESLint, type Linter } from "eslint";

const eslint = new ESLint({ cwd: process.cwd() });

async function restricted(code: string, filePath: string): Promise<Linter.LintMessage[]> {
  const [result] = await eslint.lintText(code, { filePath });
  return (result?.messages ?? []).filter((m) => m.ruleId?.endsWith("no-restricted-imports"));
}

describe("content/UI boundaries", () => {
  it("blocks UI components from importing content directly", async () => {
    const messages = await restricted(
      `import { site } from "@content/site";\nexport const x = site;\n`,
      "src/components/ui/example.tsx",
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.message).toMatch(/@\/lib\/content/);
  });

  it("blocks app routes from importing content directly", async () => {
    const messages = await restricted(
      `import { site } from "@content/site";\nexport default function Page() { return site; }\n`,
      "src/app/example/page.tsx",
    );
    expect(messages).toHaveLength(1);
  });

  it("lets the content accessors import content", async () => {
    const messages = await restricted(
      `import { site } from "@content/site";\nexport const getSite = () => site;\n`,
      "src/lib/content/site.ts",
    );
    expect(messages).toHaveLength(0);
  });

  it("blocks parent-relative imports inside src", async () => {
    const messages = await restricted(
      `import { x } from "../util";\nexport const y = x;\n`,
      "src/features/hero/hero.ts",
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.message).toMatch(/alias/);
  });

  it("allows type-only imports from src inside content files", async () => {
    const messages = await restricted(
      `import type { Site } from "@/lib/content/types";\nexport const site: Site = {} as Site;\n`,
      "content/example.ts",
    );
    expect(messages).toHaveLength(0);
  });

  it("blocks runtime imports from src inside content files", async () => {
    const messages = await restricted(
      `import { cn } from "@/lib/utils";\nexport const x = cn;\n`,
      "content/example.ts",
    );
    expect(messages).toHaveLength(1);
  });

  it("blocks React and Next imports inside content files", async () => {
    const messages = await restricted(
      `import React from "react";\nexport const x = React;\n`,
      "content/example.ts",
    );
    expect(messages).toHaveLength(1);
  });
});

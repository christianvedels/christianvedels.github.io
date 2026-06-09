import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

const args = process.argv.slice(2);
const inputPath = args[0] ?? "pages";
const outputPath = args[1] ?? "site";

async function main() {
  const absoluteInput = path.resolve(process.cwd(), inputPath);
  const inputStats = await fs.stat(absoluteInput);

  if (inputStats.isDirectory()) {
    await buildDirectorySite(absoluteInput, path.resolve(process.cwd(), outputPath));
    return;
  }

  await buildSingleFile(absoluteInput, path.resolve(process.cwd(), outputPath));
}

async function buildDirectorySite(inputDir, outputDir) {
  const markdownFiles = await getMarkdownFiles(inputDir);
  if (markdownFiles.length === 0) {
    throw new Error(`No .md files found in ${path.relative(process.cwd(), inputDir)}`);
  }

  const staticFiles = await getStaticFiles(inputDir);

  const pages = [];
  for (const file of markdownFiles) {
    const markdown = await fs.readFile(file, "utf8");
    const metadata = getPageMetadata(markdown);
    const relativeFromInput = path.relative(inputDir, file);
    const htmlRelative = relativeFromInput.replace(/\.md$/i, ".html");
    const outputFile = path.join(outputDir, htmlRelative);
    pages.push({
      sourceFile: file,
      sourceRelative: relativeFromInput,
      outputFile,
      outputRelative: htmlRelative,
      title: metadata.pageTitle,
      markdown,
    });
  }

  for (const page of pages) {
    const navigation = pages.map((item) => ({
      title: item.title,
      href: path.relative(path.dirname(page.outputFile), item.outputFile).replaceAll(path.sep, "/"),
      isCurrent: item.outputFile === page.outputFile,
    }));
    const html = renderPage(page.markdown, navigation);
    await fs.mkdir(path.dirname(page.outputFile), { recursive: true });
    await fs.writeFile(page.outputFile, html, "utf8");
    console.log(
      `Built ${path.relative(process.cwd(), page.outputFile)} from ${path.relative(process.cwd(), page.sourceFile)}`,
    );
  }

  const landingPage = getLandingPage(pages);
  const landingNavigation = pages.map((item) => ({
    title: item.title,
    href: path.relative(outputDir, item.outputFile).replaceAll(path.sep, "/"),
    isCurrent: item.outputFile === landingPage.outputFile,
  }));
  const landingHtml = renderPage(landingPage.markdown, landingNavigation);
  const landingOutput = path.join(outputDir, "index.html");
  await fs.writeFile(landingOutput, landingHtml, "utf8");
  console.log(
    `Built ${path.relative(process.cwd(), landingOutput)} from ${path.relative(process.cwd(), landingPage.sourceFile)}`,
  );

  for (const file of staticFiles) {
    const relative = path.relative(inputDir, file);
    const target = path.join(outputDir, relative);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(file, target);
    console.log(`Copied ${path.relative(process.cwd(), target)} from ${path.relative(process.cwd(), file)}`);
  }
}

function getLandingPage(pages) {
  const byStartName = pages.find((page) =>
    page.sourceRelative.replaceAll("\\", "/").toLowerCase().endsWith("start.md"),
  );
  if (byStartName) {
    return byStartName;
  }

  const byIndexName = pages.find((page) =>
    page.sourceRelative.replaceAll("\\", "/").toLowerCase().endsWith("index.md"),
  );
  if (byIndexName) {
    return byIndexName;
  }

  return pages[0];
}

async function buildSingleFile(inputFile, outputFile) {
  const markdown = await fs.readFile(inputFile, "utf8");
  const html = renderPage(markdown, []);
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, html, "utf8");
  console.log(
    `Built ${path.relative(process.cwd(), outputFile)} from ${path.relative(process.cwd(), inputFile)}`,
  );
}

function renderPage(markdown, navigation) {
  const { pageTitle } = getPageMetadata(markdown);

  const rawHtml = marked.parse(markdown);
  const contentHtml = wrapSectionsInPanels(rawHtml);
  const navHtml = renderNavigation(navigation);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f7fb;
      --paper: #ffffff;
      --text: #1d2532;
      --muted: #4b5668;
      --line: #dbe2ea;
      --accent: #0057a3;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, sans-serif;
      background: linear-gradient(180deg, #eef2f9 0%, var(--bg) 55%);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
    }

    main {
      width: min(900px, 100%);
      margin: 0 auto;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 12px 36px rgba(17, 38, 74, 0.08);
    }

    .topbar {
      margin-bottom: 1rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid var(--line);
    }

    .menu {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .menu a {
      text-decoration: none;
      border: 1px solid #c9d8eb;
      border-radius: 999px;
      color: var(--accent);
      padding: 0.3rem 0.75rem;
      font-size: 0.92rem;
      background: #f5faff;
    }

    .menu a[aria-current="page"] {
      background: #dfeefd;
      border-color: #9cc2ea;
      color: #0b3f73;
      font-weight: 600;
    }

    .panels {
      display: grid;
      gap: 1rem;
    }

    .panel {
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 1rem 1.1rem;
      background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
      box-shadow: 0 6px 16px rgba(17, 38, 74, 0.04);
    }

    h1, h2, h3 {
      line-height: 1.25;
      margin: 1.4em 0 0.6em;
      color: #101722;
    }

    h1 {
      margin-top: 0;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      border-bottom: 2px solid var(--line);
      padding-bottom: 0.5rem;
    }

    h2 {
      font-size: 1.25rem;
      color: var(--accent);
      border-bottom: 1px solid var(--line);
      padding-bottom: 0.3rem;
    }

    .panel > h2 {
      margin-top: 0;
    }

    p, li { color: var(--text); }

    ul, ol { padding-left: 1.25rem; }

    a { color: var(--accent); }

    code {
      background: #f2f5f9;
      border: 1px solid #e4ebf3;
      border-radius: 6px;
      padding: 0.12rem 0.35rem;
      font-size: 0.92em;
    }

    blockquote {
      margin: 0.9rem 0;
      padding: 0.1rem 1rem;
      border-left: 4px solid #c2d6ee;
      color: var(--muted);
      background: #f8fbff;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
    }

    th, td {
      border: 1px solid var(--line);
      padding: 0.5rem;
      text-align: left;
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
      }

      main {
        border: 0;
        border-radius: 0;
        width: 100%;
        box-shadow: none;
        padding: 0;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    }
  </style>
</head>
<body>
  <main>
    ${navHtml}
    <div class="panels">${contentHtml}</div>
  </main>
</body>
</html>
`;
}

function getPageMetadata(markdown) {
  const tokens = marked.lexer(markdown);
  const firstHeading = tokens.find(
    (token) => token.type === "heading" && token.depth === 1,
  );
  return {
    pageTitle: firstHeading?.text ?? "Curriculum Vitae",
  };
}

function renderNavigation(navigation) {
  if (navigation.length === 0) {
    return "";
  }

  const items = navigation
    .map((item) => {
      const href = escapeHtml(item.href);
      const label = escapeHtml(item.title);
      const current = item.isCurrent ? ' aria-current="page"' : "";
      return `<a href="${href}"${current}>${label}</a>`;
    })
    .join("");

  return `<nav class="topbar"><div class="menu">${items}</div></nav>`;
}

async function getMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getMarkdownFiles(fullPath);
      }
      if (
        entry.isFile()
        && entry.name.toLowerCase().endsWith(".md")
        && entry.name.toLowerCase() !== "readme.md"
      ) {
        return [fullPath];
      }
      return [];
    }),
  );
  return files.flat().sort((a, b) => a.localeCompare(b));
}

async function getStaticFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getStaticFiles(fullPath);
      }
      if (entry.isFile() && !entry.name.toLowerCase().endsWith(".md")) {
        return [fullPath];
      }
      return [];
    }),
  );
  return files.flat().sort((a, b) => a.localeCompare(b));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function wrapSectionsInPanels(html) {
  const regex = /<h2>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2>|$)/g;
  return html.replace(regex, (_match, heading, content) => {
    return `<section class="panel"><h2>${heading}</h2>${content.trim()}</section>`;
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

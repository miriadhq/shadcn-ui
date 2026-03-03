#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"

const packageRoot = new URL("..", import.meta.url).pathname
const rescriptDir = path.join(packageRoot, "rescript")
const registryPath = path.join(rescriptDir, "registry.json")

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** PascalCase → kebab-case: "AlertDialog" → "alert-dialog", "TypographyH1" → "typography-h1" */
function toKebab(name) {
  return name.replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase()
}

/** Known npm packages that are implicitly available */
const IMPLICIT_PACKAGES = new Set([
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "@rescript/runtime",
  "@rescript/react",
  "tailwind-merge",
])

/** Extract npm package name: "@base-ui/react/accordion" → "@base-ui/react" */
function extractNpmPackage(specifier) {
  if (specifier.startsWith("@")) {
    const parts = specifier.split("/")
    return `${parts[0]}/${parts[1]}`
  }
  return specifier.split("/")[0]
}

/** Parse ES module imports from a .mjs file */
function parseImports(mjsPath) {
  const npmPackages = new Set()
  const localImports = new Set()

  if (!existsSync(mjsPath)) return { npmPackages, localImports }

  const content = readFileSync(mjsPath, "utf8")
  const importRegex =
    /import\s+(?:\*\s+as\s+[\w$]+|[\w$]+|\{[^}]*\})\s+from\s+"([^"]+)"/g
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const specifier = match[1]
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      localImports.add(specifier)
    } else {
      if (
        !IMPLICIT_PACKAGES.has(specifier) &&
        !specifier.startsWith("@rescript/")
      ) {
        npmPackages.add(extractNpmPackage(specifier))
      }
    }
  }

  return { npmPackages, localImports }
}

// ---------------------------------------------------------------------------
// Scan directories
// ---------------------------------------------------------------------------

/** List .res files in a directory (basenames without extension) */
function listResFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".res"))
    .map((f) => f.slice(0, -4)) // strip .res
    .sort()
}

const uiModules = listResFiles(path.join(rescriptDir, "ui"))
const rtlModules = listResFiles(path.join(rescriptDir, "ui-rtl"))
const exampleModules = listResFiles(path.join(rescriptDir, "examples"))

// Build a map: relative .res path (from rescript/) → registry item name
// e.g. "ui/Accordion.res" → "accordion"
const pathToName = new Map()
for (const mod of uiModules) {
  pathToName.set(`ui/${mod}.res`, toKebab(mod))
}
for (const mod of rtlModules) {
  pathToName.set(`ui-rtl/${mod}.res`, toKebab(mod))
}
for (const mod of exampleModules) {
  pathToName.set(`examples/${mod}.res`, toKebab(mod))
}

/** Resolve a local import to a registry item name.
 *  importPath: the raw import string, e.g. "../ui/Button.res.mjs" or "./Foo.res.mjs"
 *  fromDir: the directory of the importing file, e.g. "ui", "ui-rtl", "examples"
 */
function resolveLocalImport(importPath, fromDir) {
  // Strip .mjs suffix → e.g. "../ui/Button.res"
  const withoutMjs = importPath.replace(/\.mjs$/, "")
  // Resolve relative to fromDir
  const resolved = path.normalize(path.join(fromDir, withoutMjs))
  return pathToName.get(resolved) ?? null
}

// ---------------------------------------------------------------------------
// Build items
// ---------------------------------------------------------------------------

/** Build a registry item from a .res file */
function buildItem(mod, dir, type) {
  const resPath = `${dir}/${mod}.res`
  const mjsPath = path.join(rescriptDir, `${dir}/${mod}.res.mjs`)
  const name = toKebab(mod)

  const { npmPackages, localImports } = parseImports(mjsPath)

  // Resolve local imports to registry dependency names
  const registryDeps = []
  for (const imp of [...localImports].sort()) {
    const depName = resolveLocalImport(imp, dir)
    if (depName) registryDeps.push(depName)
  }

  const item = { name, type }

  const sortedNpmDeps = [...npmPackages].sort()
  if (sortedNpmDeps.length > 0) item.dependencies = sortedNpmDeps
  if (registryDeps.length > 0)
    item.registryDependencies = registryDeps.sort()

  item.files = [{ path: resPath, type }]

  return item
}

// Hardcoded metadata-only items
const METADATA_ITEMS = [
  {
    name: "index",
    type: "registry:style",
    dependencies: ["class-variance-authority", "lucide-react"],
    devDependencies: ["tw-animate-css"],
    registryDependencies: ["utils"],
    files: [],
    cssVars: {},
  },
  {
    name: "style",
    type: "registry:style",
    dependencies: ["class-variance-authority", "lucide-react"],
    devDependencies: ["tw-animate-css"],
    registryDependencies: ["utils"],
    files: [],
    cssVars: {},
  },
]

// Sidebar-specific extra fields
const SIDEBAR_EXTRA = {
  tailwind: {
    config: {
      theme: {
        extend: {
          colors: {
            sidebar: {
              DEFAULT: "hsl(var(--sidebar-background))",
              foreground: "hsl(var(--sidebar-foreground))",
              primary: "hsl(var(--sidebar-primary))",
              "primary-foreground":
                "hsl(var(--sidebar-primary-foreground))",
              accent: "hsl(var(--sidebar-accent))",
              "accent-foreground":
                "hsl(var(--sidebar-accent-foreground))",
              border: "hsl(var(--sidebar-border))",
              ring: "hsl(var(--sidebar-ring))",
            },
          },
        },
      },
    },
  },
  cssVars: {
    light: {
      "sidebar-background": "0 0% 98%",
      "sidebar-foreground": "240 5.3% 26.1%",
      "sidebar-primary": "240 5.9% 10%",
      "sidebar-primary-foreground": "0 0% 98%",
      "sidebar-accent": "240 4.8% 95.9%",
      "sidebar-accent-foreground": "240 5.9% 10%",
      "sidebar-border": "220 13% 91%",
      "sidebar-ring": "217.2 91.2% 59.8%",
    },
    dark: {
      "sidebar-background": "240 5.9% 10%",
      "sidebar-foreground": "240 4.8% 95.9%",
      "sidebar-primary": "224.3 76.3% 48%",
      "sidebar-primary-foreground": "0 0% 100%",
      "sidebar-accent": "240 3.7% 15.9%",
      "sidebar-accent-foreground": "240 4.8% 95.9%",
      "sidebar-border": "240 3.7% 15.9%",
      "sidebar-ring": "217.2 91.2% 59.8%",
    },
  },
}

// Build all items
const items = [
  ...METADATA_ITEMS,
  ...uiModules.map((mod) => {
    const item = buildItem(mod, "ui", "registry:ui")
    if (item.name === "sidebar") Object.assign(item, SIDEBAR_EXTRA)
    return item
  }),
  ...rtlModules.map((mod) => buildItem(mod, "ui-rtl", "registry:ui")),
  ...exampleModules.map((mod) =>
    buildItem(mod, "examples", "registry:example")
  ),
]

const registry = {
  name: "rescript-shadcn",
  homepage: "https://github.com/miriadhq/rescript-shadcn",
  items,
}

const output = JSON.stringify(registry, null, 2) + "\n"

// ---------------------------------------------------------------------------
// --check mode or write
// ---------------------------------------------------------------------------

const isCheck = process.argv.includes("--check")

if (isCheck) {
  const current = existsSync(registryPath)
    ? readFileSync(registryPath, "utf8")
    : ""
  if (current !== output) {
    console.error(
      "registry.json is out of date. Run `node scripts/generate-registry.mjs` to regenerate."
    )
    process.exit(1)
  }
  console.log("registry.json is up to date.")
} else {
  writeFileSync(registryPath, output)
  console.log(`Wrote ${registryPath}`)
}

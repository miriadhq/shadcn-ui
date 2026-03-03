import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const packageRoot = path.resolve(__dirname, "../..")
const rescriptDir = path.resolve(packageRoot, "rescript")
const registryPath = path.resolve(rescriptDir, "registry.json")

type RegistryFile = { path: string; type: string }
type RegistryItem = {
  name: string
  type: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}
type Registry = {
  name: string
  items: RegistryItem[]
}

const registry: Registry = JSON.parse(readFileSync(registryPath, "utf8"))

// Known npm packages that are implicitly available (peer deps, react ecosystem, rescript runtime)
const IMPLICIT_PACKAGES = new Set([
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "@rescript/runtime",
  "@rescript/react",
  "tailwind-merge",
])

// Map from .mjs local import (e.g. "./Button.res.mjs") to registry component name
function localImportToRegistryName(importPath: string): string | null {
  // ./Button.res.mjs -> Button
  const match = importPath.match(/^\.\/(\w+)\.res\.mjs$/)
  if (!match) return null
  const moduleName = match[1]

  // Find which registry item has this file
  for (const item of registry.items) {
    for (const file of item.files) {
      const fileName = path.basename(file.path, ".res")
      if (fileName === moduleName) {
        return item.name
      }
    }
  }
  return null
}

// Extract npm package name from an import specifier
// "@base-ui/react/accordion" -> "@base-ui/react"
// "lucide-react" -> "lucide-react"
// "cmdk" -> "cmdk"
// "embla-carousel-react" -> "embla-carousel-react"
function extractNpmPackage(importSpecifier: string): string {
  if (importSpecifier.startsWith("@")) {
    // Scoped package: @scope/name/subpath -> @scope/name
    const parts = importSpecifier.split("/")
    return `${parts[0]}/${parts[1]}`
  }
  // Regular package: name/subpath -> name
  return importSpecifier.split("/")[0]
}

// Parse imports from a .mjs file and return { npmPackages, localImports }
function parseImports(mjsPath: string): {
  npmPackages: Set<string>
  localImports: Set<string>
} {
  const npmPackages = new Set<string>()
  const localImports = new Set<string>()

  if (!existsSync(mjsPath)) {
    return { npmPackages, localImports }
  }

  const content = readFileSync(mjsPath, "utf8")
  // Match: import * as Foo from "specifier"
  // Match: import Foo from "specifier"
  // Match: import { Foo } from "specifier"
  const importRegex = /import\s+(?:\*\s+as\s+\w+|[\w$]+|\{[^}]*\})\s+from\s+"([^"]+)"/g
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const specifier = match[1]
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      localImports.add(specifier)
    } else {
      const pkg = extractNpmPackage(specifier)
      if (!IMPLICIT_PACKAGES.has(specifier) && !specifier.startsWith("@rescript/")) {
        npmPackages.add(pkg)
      }
    }
  }

  return { npmPackages, localImports }
}

// Items that have files (ui components, rtl components, examples)
const itemsWithFiles = registry.items.filter(
  (item) => item.files.length > 0
)

// Only ui component items (not examples, not rtl)
const uiItems = itemsWithFiles.filter(
  (item) => item.files.length > 0 && item.files[0].path.startsWith("ui/") && !item.name.startsWith("rtl-")
)

describe("registry.json", () => {
  describe("files exist", () => {
    for (const item of itemsWithFiles) {
      it(`${item.name}: all listed files exist`, () => {
        for (const file of item.files) {
          const filePath = path.join(rescriptDir, file.path)
          expect(existsSync(filePath), `${file.path} does not exist`).toBe(true)
        }
      })
    }
  })

  describe("all .res files in ui/ are registered", () => {
    const registeredUiFiles = new Set(
      itemsWithFiles.flatMap((item) =>
        item.files.filter((f) => f.path.startsWith("ui/")).map((f) => f.path)
      )
    )

    const actualUiFiles = readdirSync(path.join(rescriptDir, "ui"))
      .filter((f) => f.endsWith(".res"))
      .map((f) => `ui/${f}`)
      .sort()

    for (const file of actualUiFiles) {
      it(`${file} is registered`, () => {
        expect(
          registeredUiFiles.has(file),
          `${file} exists on disk but is not in any registry item`
        ).toBe(true)
      })
    }
  })

  describe("npm dependencies match actual imports", () => {
    for (const item of uiItems) {
      it(`${item.name}: dependencies match imports`, () => {
        const file = item.files[0]
        const mjsPath = path.join(rescriptDir, file.path.replace(/\.res$/, ".res.mjs"))
        const { npmPackages } = parseImports(mjsPath)

        const declaredDeps = new Set(
          (item.dependencies ?? []).map((d) => d.replace(/@[^@/]*$/, "")) // strip version suffix like @latest
        )

        // Check: every imported npm package should be in declared dependencies
        for (const pkg of npmPackages) {
          expect(
            declaredDeps.has(pkg),
            `${item.name} imports "${pkg}" but it's not in dependencies. Declared: [${[...declaredDeps].join(", ")}]`
          ).toBe(true)
        }

        // Check: every declared dependency should be actually imported
        for (const dep of declaredDeps) {
          expect(
            npmPackages.has(dep),
            `${item.name} declares dependency "${dep}" but doesn't import it. Actual imports: [${[...npmPackages].join(", ")}]`
          ).toBe(true)
        }
      })
    }
  })

  describe("registry dependencies match actual local imports", () => {
    for (const item of uiItems) {
      it(`${item.name}: registryDependencies match local imports`, () => {
        const file = item.files[0]
        const mjsPath = path.join(rescriptDir, file.path.replace(/\.res$/, ".res.mjs"))
        const { localImports } = parseImports(mjsPath)

        // Convert local imports to registry names
        const actualRegDeps = new Set<string>()
        for (const imp of localImports) {
          const name = localImportToRegistryName(imp)
          if (name) {
            actualRegDeps.add(name)
          }
        }

        const declaredRegDeps = new Set(item.registryDependencies ?? [])

        // Check: every local import should be in registryDependencies
        for (const dep of actualRegDeps) {
          expect(
            declaredRegDeps.has(dep),
            `${item.name} imports local module "${dep}" but it's not in registryDependencies. Declared: [${[...declaredRegDeps].join(", ")}]`
          ).toBe(true)
        }

        // Check: every declared registryDependency should be actually imported
        for (const dep of declaredRegDeps) {
          expect(
            actualRegDeps.has(dep),
            `${item.name} declares registryDependency "${dep}" but doesn't import it. Actual local imports: [${[...actualRegDeps].join(", ")}]`
          ).toBe(true)
        }
      })
    }
  })
})

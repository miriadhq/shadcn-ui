import { execFileSync } from "node:child_process"
import path from "node:path"
import { describe, it } from "vitest"

const packageRoot = path.resolve(__dirname, "../..")
const generatorPath = path.resolve(
  packageRoot,
  "scripts/generate-registry.mjs"
)

describe("registry.json", () => {
  it("is up to date with generated output", () => {
    execFileSync("node", [generatorPath, "--check"], {
      cwd: packageRoot,
      stdio: "pipe",
    })
  })
})

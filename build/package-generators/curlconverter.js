#!/usr/bin/env node

const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const projectDir = path.resolve(__dirname, '../../')
const buildDir = path.join(projectDir, 'packages', 'curlconverter')

if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true })
}
fs.mkdirSync(buildDir, { recursive: true })

const packageJsonPath = path.join(buildDir, 'package.json')
const packageLockPath = path.join(buildDir, 'package-lock.json')
const generatorsDir = path.join(buildDir, 'src', 'generators')
const tarballPath = path.join(
  projectDir,
  'build',
  'package-generators',
  'curlconverter',
  'curlconverter-4.11.0.tgz',
)
const packageLockSourcePath = path.join(
  projectDir,
  'build',
  'package-generators',
  'curlconverter',
  'package-lock.json',
)
const patchPath = path.join(
  projectDir,
  'build',
  'package-generators',
  'curlconverter',
  'curlconverter.patch',
)

process.on('uncaughtException', err => {
  if (err.stdout?.length) {
    console.error(`stdout: ${err.stdout}\n`)
  }
  if (err.stderr?.length) {
    console.error(`stderr: ${err.stderr}\n`)
  }

  throw err
})

// Prepare source files
child_process.execFileSync(
  'tar',
  ['-xf', tarballPath, '--strip-components=1'],
  { cwd: buildDir },
)
fs.cpSync(packageLockSourcePath, packageLockPath)

// Remove all generators except json
for (const file of fs.readdirSync(generatorsDir)) {
  if (file !== 'json.ts') {
    fs.rmSync(path.join(generatorsDir, file), { recursive: true, force: true })
  }
}
fs.writeFileSync(
  path.join(buildDir, 'src/index.ts'),
  'export { toJsonString } from "./generators/json.js";',
)

// Patch packages
// Patch packages
// Patch packages manually
const srcDir = path.join(buildDir, 'src')
const shellDir = path.join(srcDir, 'shell')

// Helper
function patchFile(relativePath, replacements) {
  const filePath = path.join(buildDir, relativePath)
  if (!fs.existsSync(filePath)) {
    console.error(`File not found for patching: ${filePath}`)
    return
  }
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false
  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.replace(search, replace)
      modified = true
    } else {
      console.warn(`Patch warning: Pattern not found in ${relativePath}: ${search}`)
    }
  }
  if (modified) {
    fs.writeFileSync(filePath, content)
    console.log(`Patched ${relativePath}`)
  }
}

// 1. src/Warnings.ts
patchFile('src/Warnings.ts', [
  ['import type { Parser } from "./shell/Parser.js";', 'import type { Parser } from "./shell/webParser.js";']
])

// 2. src/generators/json.ts
patchFile('src/generators/json.ts', [
  ['export function toJsonStringWarn(', 'export async function toJsonStringWarn('],
  [') + "\\n"', ') + "\\n"'], // Context check, unlikely needed
  [
    'export async function toJsonStringWarn(\n  curlCommand: string | string[],\n  warnings: Warnings = [],\n): [string, Warnings] {',
    'export async function toJsonStringWarn(\n  curlCommand: string | string[],\n  warnings: Warnings = [],\n): Promise<[string, Warnings]> {'
  ],
  // Simplified replacement for return type signature if the multiline fails
  ['): [string, Warnings] {', '): Promise<[string, Warnings]> {'],
  ['const requests = parse(curlCommand, supportedArgs, warnings);', 'const requests = await parse(curlCommand, supportedArgs, warnings);'],
  ['export function toJsonString(curlCommand: string | string[]): string {', 'export async function toJsonString(curlCommand: string | string[]): Promise<string> {'],
  ['return toJsonStringWarn(curlCommand)[0];', 'return (await toJsonStringWarn(curlCommand))[0];']
])

// 3. src/parse.ts
patchFile('src/parse.ts', [
  ['function findCommands(', 'async function findCommands('],
  ['): [Word[], Word?, Word?][] {', '): Promise<[Word[], Word?, Word?][]> {'],
  ['return tokenize(curlCommand, warnings);', 'return await tokenize(curlCommand, warnings);'],
  ['export function parse(', 'export async function parse('],
  ['): Request[] {', '): Promise<Request[]> {'],
  ['const curlCommands = findCommands(command, warnings);', 'const curlCommands = await findCommands(command, warnings);']
])

// 4. src/shell/Word.ts
patchFile('src/shell/Word.ts', [
  ['import type { Parser } from "./Parser.js";', 'import type { Parser } from "./webParser.js";']
])

// 5. src/shell/tokenizer.ts
patchFile('src/shell/tokenizer.ts', [
  ['import parser from "./Parser.js";', 'import parserPromise from "./webParser.js";'],
  ['import type { Parser } from "./Parser.js";', 'import type { Parser } from "./webParser.js";'],
  ['export function tokenize(', 'export async function tokenize('],
  ['): [Word[], Word?, Word?][] {', '): Promise<[Word[], Word?, Word?][]> {'],
  ['const ast = parser.parse(curlCommand);', 'const parser = await parserPromise\n  const ast = parser.parse(curlCommand);']
])

// 6. src/shell/webParser.ts
const webParserContent = `// This file replaces Parser.ts when curlconverter is running in the browser.

import Parser from "web-tree-sitter";
// @ts-ignore
import wasmParser from "../../../../web-tree-sitter/tree-sitter.wasm?url";
// @ts-ignore
import wasmBash from "../../tree-sitter-bash.wasm?url";

export default new Promise<Parser>(async (resolve, reject) => {
  Parser.init({
    locateFile: () => {
      if (typeof wasmParser === 'string') {
        return wasmParser;
      }

      return URL.createObjectURL(new Blob([wasmParser]));
    }
  }).then(() => {
    return Parser.Language.load(wasmBash);
  }).then(bash => {
    const parser = new Parser();
    parser.setLanguage(bash);

    resolve(parser);
  }).catch(reject);
});
export type { Parser };
`
fs.writeFileSync(path.join(shellDir, 'webParser.ts'), webParserContent)
console.log('Created src/shell/webParser.ts')

// Modify package.json
const pkgRequest = require(packageJsonPath)
delete pkgRequest.bin
delete pkgRequest.browser
delete pkgRequest.dependencies["@curlconverter/tree-sitter"]
if (pkgRequest.scripts) delete pkgRequest.scripts.prepare
if (!pkgRequest.dependencies) pkgRequest.dependencies = {}
pkgRequest.dependencies.nan = "^2.22.0"

fs.writeFileSync(packageJsonPath, JSON.stringify(pkgRequest, null, 2))

// Remove unnecessary files
const filesToRemove = [
  path.join(buildDir, 'dist/src'),
  path.join(buildDir, 'tools'),
  path.join(buildDir, 'src/shell/Parser.ts'),
  path.join(buildDir, 'src/cli.ts'),
]

filesToRemove.forEach(file => {
  fs.rmSync(file, { recursive: true, force: true })
})

// Prepare package
child_process.execSync('npm install', {
  cwd: buildDir,
  stdio: 'inherit'
})

// Build package
child_process.execSync('npm run compile', { cwd: buildDir, stdio: 'inherit' })

// Cleanup
fs.rmSync(path.join(buildDir, 'node_modules'), { recursive: true, force: true })

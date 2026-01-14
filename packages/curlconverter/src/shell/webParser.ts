// This file replaces Parser.ts when curlconverter is running in the browser.

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

// Usage: node strip.cjs <in> <out>. Reprints a TypeScript/JavaScript file without comments,
// in the compiler's own layout, so blind reviewers cannot tell arms apart by comments or formatting.
const fs = require('fs');
const path = require('path');
const ts = require(require.resolve('typescript', { paths: [process.cwd(), path.resolve(__dirname, '../../../../../..')] }));

const [input, output] = process.argv.slice(2);
const kind = /\.[cm]?tsx?$/.test(input) ? ts.ScriptKind.TS : ts.ScriptKind.JS;
const source = ts.createSourceFile(input, fs.readFileSync(input, 'utf8'), ts.ScriptTarget.Latest, true, kind);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, ts.createPrinter({ removeComments: true }).printFile(source));

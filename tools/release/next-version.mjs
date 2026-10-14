// Names the version after the last tag, from the commit messages since (Conventional Commits, CLAUDE.md "Conventions"):
// a breaking change bumps major from 1.0 on (before it minor; 1.0.0 is set by hand), a feature minor, anything else patch.
// .github/workflows/release.yml: git log --format=%B%x00 v0.4.2..HEAD | node tools/release/next-version.mjs v0.4.2
import { readFileSync } from 'node:fs';

const [major, minor, patch] = process.argv[2].replace(/^v/, '').split('.').map(Number);
const messages = readFileSync(0, 'utf8').split('\0').map((message) => message.trim());
const breaking = messages.some((message) => /^\w+(\(.*\))?!:/.test(message) || /^BREAKING[ -]CHANGE:/m.test(message));
const feature = breaking || messages.some((message) => /^feat[(:]/.test(message));
if (breaking && major > 0) console.log(`${major + 1}.0.0`);
else console.log(feature ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`);

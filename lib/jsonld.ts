// Safe serialiser for the JSON-LD <script> blocks that feed Google's rich
// results.
//
// Why this exists: `JSON.stringify` does not escape `<`, so a value containing
// the literal text `</script>` would close the script tag early and let the
// rest of the string be parsed as HTML. Every schema object here is authored in
// this repo rather than submitted by visitors, so it is not currently
// exploitable — but the day someone pipes a review, an FAQ answer or a journal
// excerpt in from an outside source, it becomes an XSS hole with no warning.
//
// Escaping these characters keeps the JSON semantically identical (JSON.parse
// turns them straight back) while making the script tag impossible to break out
// of.
export function jsonLd(schema: unknown): string {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEPARATORS, (c) => "\\u" + c.charCodeAt(0).toString(16));
}

// U+2028 and U+2029 are legal inside JSON strings but are line terminators in
// JavaScript, so leaving them raw breaks parsing of the emitted <script>.
//
// Built from char codes on purpose. Writing them as literals breaks this source
// file's own parser, and writing them as \u escapes inside a regex literal has
// repeatedly been mangled back into literals by editors and tooling in transit.
// Char codes survive every round trip. Do not "simplify" this line.
const LINE_SEPARATORS = new RegExp("[" + String.fromCharCode(0x2028, 0x2029) + "]", "g");

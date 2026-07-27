/**
 * Isthmus Meridian sets everything in Helvetica Neue with an Arial fallback —
 * both are system faces, so unlike the andcap studio there is no next/font
 * webfont to load. The family stack lives in tokens.css (--font-sans); this
 * module exists only to satisfy the shared preview/layout contract, which
 * appends `fontVariables` to <html>.
 */
export const fontVariables = "";

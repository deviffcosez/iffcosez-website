import Script from "next/script";

const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    }
  } catch (e) {}
})();
`;

// Next.js places beforeInteractive scripts in the document head and runs them
// before hydration, avoiding a client-rendered raw script element.
export default function ThemeScript() {
  return (
    // App Router supports beforeInteractive in the root layout; the Pages Router-specific lint rule does not account for that.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="theme-script" strategy="beforeInteractive">
      {THEME_SCRIPT}
    </Script>
  );
}

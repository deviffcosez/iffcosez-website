import { localizePath, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/getDictionary';
import { navItemHref, navItemNeedsAnchor, type NavNode } from '@/lib/navTree';

// One header menu entry, fully resolved on the server (label in the page's
// language, localized href) so the client Header just renders it.
export interface HeaderNavItem {
  key: string;
  label: string;
  href: string;
  // Render as a plain <a> (external, new tab, or a PDF redirect) instead of
  // a client-side <Link>.
  anchor: boolean;
  newTab: boolean;
  // CMS pages stay highlighted on any URL beneath them
  // (/reports-policies/annual-reports/2024-25/ keeps Reports & Policies lit).
  matchPrefix: boolean;
  children?: HeaderNavItem[];
}

// Deepest header level (0-based): the bar, its dropdown, and one flyout
// beside a dropdown entry. Deeper items, and anything with show_in_menu off,
// are reached from their parent page's listing instead.
export const HEADER_MAX_DEPTH = 2;

export function headerNavFromTree(
  tree: NavNode[],
  locale: Locale,
): HeaderNavItem[] {
  const toItem = (node: NavNode, depth: number): HeaderNavItem => {
    const children =
      depth < HEADER_MAX_DEPTH ? node.children.filter((c) => c.show_in_menu).map((c) => toItem(c, depth + 1)) : [];
    return {
      key: String(node.id),
      label: node.title,
      href: navItemHref(node, locale),
      anchor: navItemNeedsAnchor(node),
      newTab: node.open_in_new_tab,
      matchPrefix: node.kind === 'page',
      children: children.length > 0 ? children : undefined,
    };
  };
  // The menu is exactly the published top-level items flagged show_in_menu,
  // in sort order: adding, renaming or reordering an item in website_nav_items
  // changes the header with no code change.
  return tree.filter((node) => node.show_in_menu).map((node) => toItem(node, 0));
}

export interface FooterNavItem {
  key: string;
  label: string;
  href: string;
  anchor: boolean;
  newTab: boolean;
}

export interface FooterNavColumns {
  explore: FooterNavItem[];
  information: FooterNavItem[];
}

// Footer columns from the published tree (any depth, so the compliances page
// under Reports & Policies can sit in the footer). Null when nothing is
// flagged, so the caller keeps its built-in footer links.
export function footerNavFromTree(tree: NavNode[], locale: Locale): FooterNavColumns | null {
  const flagged: NavNode[] = [];
  const walk = (nodes: NavNode[]) => {
    for (const node of nodes) {
      if (node.footer_group) flagged.push(node);
      walk(node.children);
    }
  };
  walk(tree);
  if (flagged.length === 0) return null;
  const column = (group: 'explore' | 'information') =>
    flagged
      .filter((node) => node.footer_group === group)
      .sort((a, b) => a.footer_sort - b.footer_sort || a.id - b.id)
      .map((node) => ({
        key: String(node.id),
        label: node.title,
        href: navItemHref(node, locale),
        anchor: navItemNeedsAnchor(node),
        newTab: node.open_in_new_tab,
      }));
  return { explore: column('explore'), information: column('information') };
}

type NavLabelKey = keyof Dictionary['header']['nav'];

// The menu the site shipped with before the header moved onto
// website_nav_items. Only used when the nav can't be loaded, so an outage of
// the nav RPC never leaves the site without a header menu.
const FALLBACK_NAV: {
  key: NavLabelKey;
  href: string;
  children?: { key: NavLabelKey; href: string }[];
}[] = [
  { key: 'about', href: '/about-us/' },
  { key: 'leadership', href: '/leadership/' },
  { key: 'connectivity', href: '/connectivity/' },
  {
    key: 'zones',
    href: '/zones/sez/',
    children: [
      { key: 'sez', href: '/zones/sez/' },
      { key: 'dtz', href: '/zones/dtz/' },
    ],
  },
  { key: 'infrastructure', href: '/infrastructure/' },
  { key: 'customers', href: '/tenants/' },
  { key: 'ecosystems', href: '/eco-systems/' },
  { key: 'contact', href: '/contact-us/' },
];

export function fallbackHeaderNav(labels: Dictionary['header']['nav'], locale: Locale): HeaderNavItem[] {
  const toItem = (entry: Pick<(typeof FALLBACK_NAV)[number], 'key' | 'href'>): HeaderNavItem => ({
    key: entry.key,
    label: labels[entry.key],
    href: localizePath(entry.href, locale),
    anchor: false,
    newTab: false,
    matchPrefix: false,
  });
  return FALLBACK_NAV.map((entry) => ({ ...toItem(entry), children: entry.children?.map(toItem) }));
}

import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
    title: 'Siteguide.js',
    tagline: 'Build polished onboarding tours with vanilla JavaScript and CSS.',
    favicon: 'img/favicon.ico',
    url: 'https://handeh0ch.github.io',
    baseUrl: '/siteguide.js/',
    organizationName: 'handeh0ch',
    projectName: 'siteguide.js',
    onBrokenLinks: 'throw',
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
    },
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: 'https://github.com/handeh0ch/siteguide.js/tree/main/projects/docs',
                    routeBasePath: 'docs',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],
    themeConfig: {
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'Siteguide.js',
            items: [
                {
                    to: '/',
                    label: 'Home',
                    position: 'left',
                },
                {
                    type: 'docSidebar',
                    sidebarId: 'docsSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    href: 'https://github.com/handeh0ch/siteguide.js',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        prism: {
            theme: prismThemes.oneLight,
            darkTheme: prismThemes.oneDark,
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Introduction',
                            to: '/docs/intro',
                        },
                        {
                            label: 'Quick Start',
                            to: '/docs/getting-started/quick-start',
                        },
                        {
                            label: 'API Reference',
                            to: '/docs/api-reference/tour',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/handeh0ch/siteguide.js',
                        },
                        {
                            label: 'Releases',
                            href: 'https://github.com/handeh0ch/siteguide.js/releases',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Siteguide.js.`,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;

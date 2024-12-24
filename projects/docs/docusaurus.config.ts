import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: 'Siteguide.js',
    tagline: 'Website guides and onboarding tours building library',
    favicon: 'img/favicon.ico',
    url: 'https://siteguide.github.io',
    baseUrl: '/',
    organizationName: 'handeh0ch',
    projectName: 'siteguide.js',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
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
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],
    themeConfig: {
        // Replace with your project's social card
        // image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'Siteguide.js',
            // logo: {
            //     alt: 'My Site Logo',
            //     src: 'img/logo.svg',
            // },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'docSidebar',
                    position: 'left',
                    label: 'documentation',
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
            copyright: `Copyright © ${new Date().getFullYear()} Siteguide.js.`,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;

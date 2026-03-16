import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docsSidebar: [
        'intro',
        {
            type: 'category',
            label: 'Getting Started',
            collapsed: false,
            items: ['getting-started/installation', 'getting-started/quick-start'],
        },
        {
            type: 'category',
            label: 'Guides',
            collapsed: false,
            items: [
                'guides/tour-lifecycle',
                'guides/step-targeting-and-hosts',
                'guides/popups-and-content',
                'guides/buttons-and-actions',
                'guides/navigation-and-controls',
                'guides/styling-and-theming',
                'guides/events-and-state',
                'guides/recipes',
            ],
        },
        {
            type: 'category',
            label: 'API Reference',
            collapsed: false,
            items: ['api-reference/tour', 'api-reference/types'],
        },
        {
            type: 'category',
            label: 'Legal',
            collapsed: false,
            items: ['legal/license'],
        },
        {
            type: 'category',
            label: 'Appendix',
            collapsed: true,
            items: ['appendix/additional-exports'],
        },
    ],
};

export default sidebars;

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const featureList = [
    {
        title: 'Vanilla by default',
        description: 'Ship tours without committing to a framework runtime or component library.',
    },
    {
        title: 'Anchored or centered steps',
        description: 'Point to real UI targets, resolve them lazily, or open a centered modal-style step.',
    },
    {
        title: 'Brandable CSS surface',
        description: 'Start with the bundled stylesheet, then theme with class prefixes and per-step classes.',
    },
];

const guideLinks = [
    {
        title: 'Installation',
        href: '/docs/getting-started/installation',
        text: 'Install the package, load the stylesheet, and understand the runtime requirements.',
    },
    {
        title: 'Quick Start',
        href: '/docs/getting-started/quick-start',
        text: 'Build a working two-step tour and wire it to your application in a few lines.',
    },
    {
        title: 'API Reference',
        href: '/docs/api-reference/tour',
        text: 'Inspect the public classes, utility function, config types, popup types, and event union.',
    },
];

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout title={siteConfig.title} description={siteConfig.tagline}>
            <main className={styles.page}>
                <section className={styles.hero}>
                    <div className={styles.heroCopy}>
                        <p className={styles.eyebrow}>Lightweight product tours for real interfaces</p>
                        <h1>Build onboarding flows that look intentional, not bolted on</h1>
                        <p className={styles.lead}>
                            Siteguide.js gives you anchored steps, custom popup content, lifecycle hooks, and styling
                            controls in one small vanilla JavaScript library.
                        </p>
                        <div className={styles.actions}>
                            <Link className="button button--primary button--lg" to="/docs/getting-started/quick-start">
                                Read the docs
                            </Link>
                            <Link className={styles.secondaryAction} to="/docs/api-reference/tour">
                                Explore the API
                            </Link>
                        </div>
                        <div className={styles.installBox}>
                            <span>Install</span>
                            <code>npm install siteguide.js</code>
                        </div>
                    </div>
                    <div className={styles.heroPreview}>
                        <div className={styles.previewCanvas}>
                            <div className={styles.previewTarget} />
                            <div className={styles.previewPopup}>
                                <div className={styles.previewHeader}>
                                    <strong>Upgrade flow</strong>
                                    <button type="button" aria-label="Close preview">
                                        ×
                                    </button>
                                </div>
                                <div className={styles.previewBody}>
                                    Highlight the right UI, explain it clearly, and let the user keep moving.
                                </div>
                                <div className={styles.previewFooter}>
                                    <span>Step 2 of 4</span>
                                    <div>
                                        <button type="button" className={styles.linkButton}>
                                            Back
                                        </button>
                                        <button type="button" className={styles.primaryButton}>
                                            Next
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.previewArrow} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.featureSection}>
                    {featureList.map((feature) => (
                        <article key={feature.title} className={styles.featureCard}>
                            <h2>{feature.title}</h2>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </section>

                <section className={styles.docsSection}>
                    <div className={styles.sectionIntro}>
                        <p className={styles.eyebrow}>Documentation</p>
                        <h2>Everything in one place</h2>
                        <p>
                            The docs are organized around real implementation concerns: setup, feature guides, recipes,
                            and a curated API reference for every public export.
                        </p>
                    </div>
                    <div className={styles.docsGrid}>
                        {guideLinks.map((link) => (
                            <Link key={link.title} className={styles.docsCard} to={link.href}>
                                <strong>{link.title}</strong>
                                <p>{link.text}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}

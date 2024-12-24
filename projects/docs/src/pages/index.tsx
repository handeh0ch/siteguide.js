import { Redirect } from '@docusaurus/router';

export default function Home(): JSX.Element {
    // const { siteConfig } = useDocusaurusContext();
    return (
        // <Layout title={`Docs ${siteConfig.title}`} description="Web-site guides and onboarding tours building library">
        //     <HomepageHeader />
        //     <main></main>
        // </Layout>
        <Redirect to="/docs/intro" />
    );
}

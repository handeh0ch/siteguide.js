/**
 * Generates the HTML for a close icon.
 * @param {string} classPrefix - The prefix for the CSS classes used in the close icon.
 * @returns {InnerHTML} The inner HTML for the close icon.
 */
export function getCloseIconHTML(classPrefix: string): InnerHTML {
    return {
        innerHTML: `
<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 162 162"
    class="${classPrefix}-close-icon"
>
    <path
        stroke-linecap="round"
        stroke-width="17"
        stroke="black"
        d="M9.01074 8.98926L153.021 153"
    ></path>
    <path
        stroke-linecap="round"
        stroke-width="17"
        stroke="black"
        d="M9.01074 153L153.021 8.98926"
    ></path>
</svg>
        `,
    };
}

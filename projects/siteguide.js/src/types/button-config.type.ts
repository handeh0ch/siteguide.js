export type ButtonConfig = {
    text: string;
    className?: string;
    action: () => void | (() => Promise<void>);
};

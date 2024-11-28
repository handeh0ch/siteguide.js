export type ButtonConfig = {
    title: string;
    className?: string;
    action: () => void | (() => Promise<void>);
};

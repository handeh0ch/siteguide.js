import { TourStep } from '../tour-step';
import { getPositionType } from '../utils/is-fixed.util';
import type { IRenderer } from './interfaces/renderer.interface';

export class HighlightRenderer implements IRenderer {
    /** @inheritdoc */
    public render(element: HTMLElement, step: TourStep): Promise<void> {
        return new Promise<void>((resolve) => {
            if (step.hostElement) {
                element.style.position = getPositionType(step.hostElement);
            }

            resolve();
        }).then(() => {
            this.updatePosition(element, step);
        });
    }

    /** @inheritdoc */
    public updatePosition(element: HTMLElement, step: TourStep): void {
        if (!step.hostElement) {
            element.style.width = '0';
            element.style.height = '0';
            element.style.top = '50%';
            element.style.left = '50%';
            element.style.transform = 'translate(-50%, -50%)';
            element.style.opacity = '0';
            return;
        }

        const rect: DOMRect = step.hostElement.getBoundingClientRect();
        const padding: number = step.tour.config.highlight?.padding ?? 8;

        const scrollTop: number =
            element.style.position === 'fixed' ? 0 : window.scrollY || document.documentElement.scrollTop;

        element.style.transform = '';
        element.style.left = `${rect.left - padding}px`;
        element.style.top = `${rect.top + scrollTop - padding}px`;
        element.style.width = `${rect.width + 2 * padding}px`;
        element.style.height = `${rect.height + 2 * padding}px`;
        element.style.opacity = '1';
    }
}

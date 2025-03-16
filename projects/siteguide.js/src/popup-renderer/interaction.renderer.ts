import { TourStep } from '../tour-step';
import { getPositionType } from '../utils/is-fixed.util';
import type { IRenderer } from './interfaces/renderer.interface';

export class InteractionRenderer implements IRenderer {
    /** @inheritdoc */
    public render(helper: HTMLElement, step: TourStep): Promise<void> {
        return new Promise<void>((resolve) => {
            if (step.hostElement) {
                helper.style.position = getPositionType(step.hostElement);
            }

            resolve();
        }).then(() => {
            this.updatePosition(helper, step);
        });
    }

    /** @inheritdoc */
    public updatePosition(helper: HTMLElement, step: TourStep): void {
        if (!step.hostElement) {
            helper.style.width = '0';
            helper.style.height = '0';
            helper.style.top = '50%';
            helper.style.left = '50%';
            helper.style.transform = 'translate(-50%, -50%)';
            return;
        }

        const rect: DOMRect = step.hostElement.getBoundingClientRect();
        const padding: number = step.tour.config.highlight?.padding ?? 8;

        const scrollTop: number =
            helper.style.position === 'fixed' ? 0 : window.scrollY || document.documentElement.scrollTop;

        helper.style.transform = '';
        helper.style.left = `${rect.left - padding}px`;
        helper.style.top = `${rect.top + scrollTop - padding}px`;
        helper.style.width = `${rect.width + 2 * padding}px`;
        helper.style.height = `${rect.height + 2 * padding}px`;
    }
}

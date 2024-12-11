import { TourStep } from '../tour-step';
import { getPositionType } from '../utils/is-fixed.util';
import { IRenderer } from './interfaces/renderer.interface';

export class HelperLayoutRenderer implements IRenderer {
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
            helper.style.borderWidth = '0';
            return;
        }

        const rect: DOMRect = step.hostElement.getBoundingClientRect();
        const paddingX: number = step.tour.config.helperLayout?.paddingX ?? 8;
        const paddingY: number = step.tour.config.helperLayout?.paddingY ?? 8;

        const scrollTop: number =
            helper.style.position === 'fixed' ? 0 : window.scrollY || document.documentElement.scrollTop;

        helper.style.transform = '';
        helper.style.borderWidth = '2px';
        helper.style.left = `${rect.left - paddingX}px`;
        helper.style.top = `${rect.top + scrollTop - paddingY}px`;
        helper.style.width = `${rect.width + 2 * paddingX}px`;
        helper.style.height = `${rect.height + 2 * paddingY}px`;
    }
}

import { TourStep } from '../tour-step';
import type { IRenderer } from './interfaces/renderer.interface';

export class BackgroundRenderer implements IRenderer {
    /** @inheritdoc */
    public render(element: HTMLElement, step: TourStep): Promise<void> {
        if (step.tour.config.background.disable) {
            element.style.pointerEvents = 'none';
        } else {
            element.style.pointerEvents = 'auto';
        }

        return Promise.resolve();
    }

    /** @inheritdoc */
    public updatePosition(element: HTMLElement, step: TourStep): void {}
}

import './siteguide.css';
import { SiteguideBase, Tour } from './tour';
import { TourStep } from './tour-step';
import type { TourButtonConfig, TourButtonType } from './types/button-config.type';
import type {
    CustomPopupData,
    PopupCustomization,
    PopupData,
    PopupPosition,
    PopupType,
    SharedPopupData,
    TextPopupData,
} from './types/popup.type';
import type { PopupCloseIconElement, TourConfig } from './types/tour-config.type';
import type { PopupHost, TourStepConfig } from './types/tour-step-config.type';
import { createElement } from './utils/create-element.util';

const Siteguide = SiteguideBase as {
    get isActive(): boolean;
    get activeTour(): Tour | null;
};

export {
    createElement,
    CustomPopupData,
    PopupCloseIconElement,
    PopupCustomization,
    PopupData,
    PopupHost,
    PopupPosition,
    PopupType,
    SharedPopupData,
    Siteguide,
    TextPopupData,
    Tour,
    TourButtonConfig,
    TourButtonType,
    TourConfig,
    TourStep,
    TourStepConfig,
};

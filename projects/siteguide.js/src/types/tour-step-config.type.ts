import { PopupData } from './popup.type';

export type TourStepConfig = {
    id: StepId;
    host: HostData;
    popup: PopupData;
};

export type HostData = string | HTMLElement | (() => HTMLElement | string);

export type StepId = string;

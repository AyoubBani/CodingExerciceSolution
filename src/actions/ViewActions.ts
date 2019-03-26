import { setLanguage } from 'localization/utils';
import { Languages } from 'common/types';
import { RemoteData, InStoreApi } from 'common/types';
export type ViewAction = ToggleSideBar | UpdateLanguage | FilterData;

interface ToggleSideBar {
    type: 'TOGGLE_SIDE_BAR'
}

export const toggleSideBar = ():  ToggleSideBar => {
    return {
        type: 'TOGGLE_SIDE_BAR'
    };
};

interface UpdateLanguage {
    type: 'UPDATE_LANGUAGE',
    lang: Languages
}

export const updateLanguage = (lang: Languages): UpdateLanguage => {
    setLanguage(lang);
    return {
        type: 'UPDATE_LANGUAGE',
        lang
    };
};

interface FilterData {
    type: 'FILTER_DATA',
    rentals: RemoteData<InStoreApi[]>
}

export const updateRentals = (rentals: RemoteData<InStoreApi[]>): FilterData => {       
    return {
        type: 'FILTER_DATA',
        rentals
    };
};

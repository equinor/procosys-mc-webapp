import React from 'react';
import Navbar from '../../components/navigation/Navbar';
import removeSubdirectories from '../../utils/removeSubdirectories';
import useCommonHooks from '../../utils/useCommonHooks';
import { SavedSearchType } from '../Search/SavedSearches/SavedSearchResult';

const SavedSearchPage = (): JSX.Element => {
    const { url, params } = useCommonHooks();

    const determineContent = (): JSX.Element => {
        if (params.savedSearchType === SavedSearchType.CHECKLIST) {
            return <></>;
        } else if (params.savedSearchType === SavedSearchType.PUNCH) {
            return <></>;
        } else {
            return <></>;
        }
    };

    return (
        <main>
            <Navbar
                noBorder
                leftContent={{
                    name: 'back',
                    label: 'Back',
                    url: `${removeSubdirectories(url, 3)}`,
                }}
                midContent={`Saved ${params.savedSearchType} search`}
            />
            {
                // TODO: add title (& descr?) of saved search
            }
            {determineContent()}
        </main>
    );
};

export default SavedSearchPage;

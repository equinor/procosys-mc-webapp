import { SearchResults, TagPreview } from '../../services/apiTypes';
import { FakerTagPreview } from './fakerMCappTypes';

export const FakeSearchResults = (
    startsWithTagNo: string | null,
    projectId: string | null,
    plantId: string | null,
    maxAvailable: number
): SearchResults => {
    const fakeResults = new Array<TagPreview>();
    for (let i = 0; i < maxAvailable; i++) {
        fakeResults.push(FakerTagPreview()); //ToDo: Improve the tag name syntax to be alined with the search params
    }

    return { items: fakeResults, maxAvailable: fakeResults.length };
};

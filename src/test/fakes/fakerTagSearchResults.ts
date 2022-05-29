import { ISearchResults, ITagPreview } from './api.types';
import { FakerTagPreview } from './faker';

export const FakeSearchResults = (
    startsWithTagNo: string | null,
    projectId: string | null,
    plantId: string | null,
    maxAvailable: number
): ISearchResults => {
    const fakeResults = new Array<ITagPreview>();
    for (let i = 0; i < maxAvailable; i++) {
        fakeResults.push(FakerTagPreview()); //ToDo: Improve the tag name syntax to be alined with the search params
    }

    return { items: fakeResults, maxAvailable: fakeResults.length };
};

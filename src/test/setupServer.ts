import { setupServer } from 'msw/node';
import { rest } from 'msw';
import 'whatwg-fetch';
import {
    dummyChecklistResponse,
    dummyPunchListResponse,
    dummyAttachmentsResponse,
    testProjects,
    dummyPunchCategories,
    dummyPunchOrganizations,
    dummyPunchTypes,
    dummyPunchItemUncleared,
    testMcPkgSearch,
    testMcPkgPreview,
    testScope,
    dummyPunchSorts,
    dummyPunchPriorities,
    dummyPersonsSearch,
    dummyTagResponse,
    testWoSearch,
    testWoPreview,
    testTagSearch,
    testPoSearch,
    testPoPreview,
    testSavedSearch,
    testChecklistSavedSearch,
    testPunchListItemSavedSearch,
    dummyIPOIsAliveResponse,
    dummyCommentsReponse,
} from './dummyData';
import objectToCamelCase from '../utils/objectToCamelCase';

export const baseURL = 'https://test-url.com';
export const ENDPOINTS = {
    //General
    getMcPkgDetails: `${baseURL}/McPkg`,
    getWorkOrderDetails: `${baseURL}/WorkOrder`,
    getTag: `${baseURL}/Tag`,
    getPoDetails: `${baseURL}/PurchaseOrder`,
    getPermissions: `${baseURL}/Permissions`,
    getProjects: `${baseURL}/Projects`,

    //Search
    searchForMcPackage: `${baseURL}/McPkg/Search`,
    searchForWo: `${baseURL}/WorkOrder/Search`,
    searchForTag: `${baseURL}/Tag/Search`,
    searchForPo: `${baseURL}/PurchaseOrder/Search`,
    getSavedSearches: `${baseURL}/SavedSearches`,
    deleteSavedSearch: `${baseURL}/Search`,

    //Saved search
    getChecklistSavedSearch: `${baseURL}/CheckList/Search`,
    getPunchItemSavedSearch: `${baseURL}/PunchListItem/Search`,

    //Bookmarks
    getOfflineScope: `${baseURL}/OfflineScope`,

    // Checklist
    getMcScope: `${baseURL}/McPkg/CheckLists`,
    getWorkOrderScope: `${baseURL}/WorkOrder/CheckLists`,
    getTagScope: `${baseURL}/Tag/CheckLists`,
    getPoScope: `${baseURL}/PurchaseOrder/CheckLists`,
    getChecklist: `${baseURL}/CheckList/MC`,
    getChecklistPunchList: `${baseURL}/CheckList/PunchList`,

    //PUNCH
    getMcPunchList: `${baseURL}/McPkg/PunchList`,
    getWorkOrderPunchList: `${baseURL}/WorkOrder/PunchList`,
    getTagPunchList: `${baseURL}/Tag/PunchList`,
    getPoPunchList: `${baseURL}/PurchaseOrder/PunchList`,
    getPunchAttachment: `${baseURL}/PunchListItem/Attachment`,
    deletePunchAttachment: `${baseURL}/PunchListItem/Attachment`,
    postTempPunchAttachment: `${baseURL}/PunchListItem/TempAttachment`,
    postPunchAttachment: `${baseURL}/PunchListItem/Attachment`,
    getPunchAttachments: `${baseURL}/PunchListItem/Attachments`,
    getPunchComments: `${baseURL}/PunchListItem/Comments`,
    postPunchComment: `${baseURL}/PunchListItem/AddComment`,
    getPunchCategories: `${baseURL}/PunchListItem/Categories`,
    getPunchTypes: `${baseURL}/PunchListItem/Types`,
    getPunchOrganizations: `${baseURL}/PunchListItem/Organizations`,
    getPunchSorts: `${baseURL}/PunchListItem/Sorts`,
    getPunchPriorities: `${baseURL}/PunchListItem/Priorities`,
    postNewPunch: `${baseURL}/PunchListItem`,
    getPunchItem: `${baseURL}/PunchListItem`,
    putPunchClearingBy: `${baseURL}/PunchListItem/SetClearingBy`,
    putPunchRaisedBy: `${baseURL}/PunchListItem/SetRaisedBy`,
    putPunchDescription: `${baseURL}/PunchListItem/SetDescription`,
    putPunchType: `${baseURL}/PunchListItem/SetType`,
    putPunchCategory: `${baseURL}/PunchListItem/SetCategory`,
    putPunchActionByPerson: `${baseURL}/PunchListItem/SetActionByPerson`,
    putPunchDueDate: `${baseURL}/PunchListItem/SetDueDate`,
    putPunchSorting: `${baseURL}/PunchListItem/SetSorting`,
    putPunchPriority: `${baseURL}/PunchListItem/SetPriority`,
    putPunchEstimate: `${baseURL}/PunchListItem/SetEstimate`,
    postPunchClear: `${baseURL}/PunchListItem/Clear`,
    postPunchUnclear: `${baseURL}/PunchListItem/Unclear`,
    postPunchVerify: `${baseURL}/PunchListItem/Verify`,
    postPunchUnverify: `${baseURL}/PunchListItem/Unverify`,
    postPunchReject: `${baseURL}/PunchListItem/Reject`,

    //PERSON
    getPersons: `${baseURL}/Person/PersonSearch`,

    //Work Order Attachments
    getWorkOrderAttachments: `${baseURL}/WorkOrder/Attachments`,
    getWorkOrderAttachment: `${baseURL}/WorkOrder/Attachment`,

    //IPO
    isAlive: `${baseURL}/IsAlive`,
};

export const server = setupServer(
    //General
    rest.get(ENDPOINTS.getMcPkgDetails, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testMcPkgPreview[0])),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getWorkOrderDetails, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testWoPreview[0])),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPoDetails, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testPoPreview[0])),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getProjects, (_, response, context) => {
        return response(context.json(testProjects), context.status(200));
    }),
    rest.get(ENDPOINTS.getPermissions, (_, response, context) => {
        return response(context.json(['COMMPKG/READ']), context.status(200));
    }),

    //Search
    rest.get(ENDPOINTS.searchForMcPackage, (_, response, context) => {
        return response(context.json(testMcPkgSearch), context.status(200));
    }),
    rest.get(ENDPOINTS.searchForWo, (_, response, context) => {
        return response(context.json(testWoSearch), context.status(200));
    }),
    rest.get(ENDPOINTS.searchForTag, (_, response, context) => {
        return response(context.json(testTagSearch), context.status(200));
    }),
    rest.get(ENDPOINTS.searchForPo, (_, response, context) => {
        return response(context.json(testPoSearch), context.status(200));
    }),
    rest.get(ENDPOINTS.getSavedSearches, (_, response, context) => {
        return response(context.json(testSavedSearch), context.status(200));
    }),
    rest.delete(ENDPOINTS.deleteSavedSearch, (_, response, context) => {
        return response(context.status(200));
    }),

    // Saved Search
    rest.get(ENDPOINTS.getChecklistSavedSearch, (_, response, context) => {
        return response(
            context.json(testChecklistSavedSearch),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchItemSavedSearch, (_, response, context) => {
        return response(
            context.json(testPunchListItemSavedSearch),
            context.status(200)
        );
    }),

    //Bookmarks
    rest.get(ENDPOINTS.getOfflineScope, (_, response, context) => {
        return response(context.json(null), context.status(200));
    }),

    //Checklist
    rest.get(ENDPOINTS.getChecklist, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyChecklistResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getChecklistPunchList, (_, response, context) => {
        return response(
            context.json(dummyPunchListResponse),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getMcScope, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testScope)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getWorkOrderScope, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testScope)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTagScope, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testScope)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPoScope, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testScope)),
            context.status(200)
        );
    }),

    // TAG
    rest.get(ENDPOINTS.getTag, (_, response, context) => {
        return response(context.json(dummyTagResponse), context.status(200));
    }),

    // PUNCH
    rest.get(ENDPOINTS.getMcPunchList, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getWorkOrderPunchList, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTagPunchList, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPoPunchList, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchAttachment, (_, response, context) => {
        return response(context.json(new Blob()), context.status(200));
    }),
    rest.get(ENDPOINTS.getPunchAttachments, (_, response, context) => {
        return response(
            context.json(dummyAttachmentsResponse),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchCategories, (_, response, context) => {
        return response(
            context.json(dummyPunchCategories),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchOrganizations, (_, response, context) => {
        return response(
            context.json(dummyPunchOrganizations),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchTypes, (_, response, context) => {
        return response(context.json(dummyPunchTypes), context.status(200));
    }),
    rest.get(ENDPOINTS.getPunchItem, (_, response, context) => {
        return response(
            context.json(dummyPunchItemUncleared),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchSorts, (_, response, context) => {
        return response(context.json(dummyPunchSorts), context.status(200));
    }),
    rest.get(ENDPOINTS.getPunchPriorities, (_, response, context) => {
        return response(
            context.json(dummyPunchPriorities),
            context.status(200)
        );
    }),

    rest.get(ENDPOINTS.getPunchComments, (_, response, context) => {
        return response(
            context.json(dummyCommentsReponse),
            context.status(200)
        );
    }),

    rest.post(ENDPOINTS.postNewPunch, (_, response, context) => {
        return response(context.status(200));
    }),

    rest.get(ENDPOINTS.getPersons, (_, response, context) => {
        return response(context.json(dummyPersonsSearch), context.status(200));
    }),
    rest.post(ENDPOINTS.postPunchClear, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postPunchUnclear, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postPunchReject, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchCategory, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchDescription, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchRaisedBy, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchClearingBy, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchActionByPerson, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchDueDate, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchType, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchSorting, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchPriority, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putPunchEstimate, (_, response, context) => {
        return response(context.status(200));
    }),

    // Work Order Attachments
    rest.get(ENDPOINTS.getWorkOrderAttachment, (_, response, context) => {
        return response(context.json(new Blob()), context.status(200));
    }),
    rest.get(ENDPOINTS.getWorkOrderAttachments, (_, response, context) => {
        return response(
            context.json(dummyAttachmentsResponse),
            context.status(200)
        );
    }),

    //IPO
    rest.get(ENDPOINTS.isAlive, (_, response, context) => {
        return response(
            context.json(dummyIPOIsAliveResponse),
            context.status(200)
        );
    })
);

const causeApiError = (
    endpoint: string,
    method: 'get' | 'put' | 'post' | 'delete'
): void => {
    let callToIntercept = rest.get(endpoint, (_, response, context) => {
        return response(context.status(400), context.text('dummy error'));
    });
    if (method === 'post') {
        callToIntercept = rest.post(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    if (method === 'put') {
        callToIntercept = rest.put(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    if (method === 'get') {
        callToIntercept = rest.get(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    if (method === 'delete') {
        callToIntercept = rest.delete(endpoint, (_, response, context) => {
            return response(context.status(400), context.text('dummy error'));
        });
    }
    return server.use(callToIntercept);
};
export { rest, causeApiError };

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
    dummyChecklistResponse,
    dummyPunchListResponse,
    dummyScopeResponse,
    dummyAttachmentsResponse,
    testProjects,
    dummyPunchCategories,
    dummyPunchOrganizations,
    dummyPunchTypes,
    dummyPunchItemUncleared,
    testMcPkgSearch,
    testMcPkgPreview,
    dummyCommPkgDetailsResponse,
    testScope,
} from './dummyData';
import objectToCamelCase from '../utils/objectToCamelCase';

export const baseURL = 'https://test-url.com';
export const ENDPOINTS = {
    //General
    getMcPkgDetails: `${baseURL}/McPkg`,
    getCommPkgDetails: `${baseURL}/CommPkg`, // TODO: remove
    getPermissions: `${baseURL}/Permissions`,
    getProjects: `${baseURL}/Projects`,

    //Search
    searchForMcPackage: `${baseURL}/McPkg/Search`,

    // Checklist
    putMetaTableCell: `${baseURL}/CheckList/Item/MetaTableCell`,
    getChecklistAttachments: `${baseURL}/CheckList/Attachments`,
    postSetNA: `${baseURL}/CheckList/Item/SetNA`,
    postSetOk: `${baseURL}/CheckList/Item/SetOk`,
    postClear: `${baseURL}/CheckList/Item/Clear`,
    getMcScope: `${baseURL}/McPkg/CheckLists`,
    getChecklist: `${baseURL}/CheckList/MC`,
    getChecklistPunchList: `${baseURL}/CheckList/PunchList`,
    // TODO: remove the endpoints below (?)
    putChecklistComment: `${baseURL}/CheckList/Comm/Comment`,
    postSign: `${baseURL}/CheckList/Comm/Sign`,
    postUnsign: `${baseURL}/CheckList/Comm/Unsign`,
    getScope: `${baseURL}/CommPkg/CheckLists`,

    //PUNCH
    getMcPunchList: `${baseURL}/McPkg/PunchList`,
    getPunchList: `${baseURL}/CommPkg/PunchList`, // TODO: remove
    getPunchAttachment: `${baseURL}/PunchListItem/Attachment`,
    deletePunchAttachment: `${baseURL}/PunchListItem/Attachment`,
    postTempPunchAttachment: `${baseURL}/PunchListItem/TempAttachment`,
    postPunchAttachment: `${baseURL}/PunchListItem/Attachment`,
    getPunchAttachments: `${baseURL}/PunchListItem/Attachments`,
    getPunchCategories: `${baseURL}/PunchListItem/Categories`,
    getPunchTypes: `${baseURL}/PunchListItem/Types`,
    getPunchOrganizations: `${baseURL}/PunchListItem/Organizations`,
    postNewPunch: `${baseURL}/PunchListItem`,
    getPunchItem: `${baseURL}/PunchListItem`,
    putPunchClearingBy: `${baseURL}/PunchListItem/SetClearingBy`,
    putPunchRaisedBy: `${baseURL}/PunchListItem/SetRaisedBy`,
    putPunchDescription: `${baseURL}/PunchListItem/SetDescription`,
    putPunchType: `${baseURL}/PunchListItem/SetType`,
    putPunchCategory: `${baseURL}/PunchListItem/SetCategory`,
    postPunchClear: `${baseURL}/PunchListItem/Clear`,
    postPunchUnclear: `${baseURL}/PunchListItem/Unclear`,
    postPunchVerify: `${baseURL}/PunchListItem/Verify`,
    postPunchUnverify: `${baseURL}/PunchListItem/Unverify`,
    postPunchReject: `${baseURL}/PunchListItem/Reject`,
};

// TODO: remove all that use aen endpoint that needs removal
export const server = setupServer(
    //General
    rest.get(ENDPOINTS.getMcPkgDetails, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testMcPkgPreview[0])),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getCommPkgDetails, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyCommPkgDetailsResponse)),
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

    //Checklist
    rest.put(ENDPOINTS.putMetaTableCell, (_, response, context) => {
        return response(context.status(200));
    }),
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
    rest.get(ENDPOINTS.getChecklistAttachments, (_, response, context) => {
        return response(
            context.delay(10),
            context.json(objectToCamelCase(dummyAttachmentsResponse)),
            context.status(200)
        );
    }),
    rest.post(ENDPOINTS.postSetNA, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postSetOk, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postClear, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.get(ENDPOINTS.getMcScope, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(testScope)),
            context.status(200)
        );
    }),
    rest.put(ENDPOINTS.putChecklistComment, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postSign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postUnsign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.get(ENDPOINTS.getScope, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyScopeResponse)),
            context.status(200)
        );
    }),

    // PUNCH
    rest.get(ENDPOINTS.getMcPunchList, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyPunchListResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getPunchList, (_, response, context) => {
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
    rest.post(ENDPOINTS.postNewPunch, (_, response, context) => {
        return response(context.status(200));
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

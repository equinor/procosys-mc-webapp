import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
    dummyChecklistResponse,
    dummyCommPkgDetailsResponse,
    dummyPunchListResponse,
    dummyScopeResponse,
    dummyAttachmentsResponse,
    dummyTaskParametersResponse,
    dummyTaskResponse,
    dummyTasksResponse,
    testProjects,
    dummyPunchCategories,
    dummyPunchOrganizations,
    dummyPunchTypes,
    dummyPunchItemUncleared,
} from './dummyData';
import objectToCamelCase from '../utils/objectToCamelCase';

export const baseURL = 'https://test-url.com';
export const ENDPOINTS = {
    //General
    getCommPkgDetails: `${baseURL}/CommPkg`,
    getPermissions: `${baseURL}/Permissions`,
    getProjects: `${baseURL}/Projects`,

    // Checklist
    putMetaTableCell: `${baseURL}/CheckList/Item/MetaTableCell`,
    getChecklist: `${baseURL}/CheckList/Comm`,
    getChecklistAttachments: `${baseURL}/CheckList/Attachments`,
    putChecklistComment: `${baseURL}/CheckList/Comm/Comment`,
    postSetNA: `${baseURL}/CheckList/Item/SetNA`,
    postSetOk: `${baseURL}/CheckList/Item/SetOk`,
    postClear: `${baseURL}/CheckList/Item/Clear`,
    postSign: `${baseURL}/CheckList/Comm/Sign`,
    postUnsign: `${baseURL}/CheckList/Comm/Unsign`,
    getScope: `${baseURL}/CommPkg/CheckLists`,

    //Task
    getTasks: `${baseURL}/CommPkg/Tasks`,
    getTask: `${baseURL}/CommPkg/Task`,
    getTaskParameters: `${baseURL}/CommPkg/Task/Parameters`,
    putTaskParameter: `${baseURL}/CommPkg/Task/Parameters/Parameter`,
    getTaskAttachments: `${baseURL}/CommPkg/Task/Attachments`,
    getTaskAttachment: `${baseURL}/CommPkg/Task/Attachment`,
    putTaskComment: `${baseURL}/CommPkg/Task/Comment`,
    postTaskSign: `${baseURL}/CommPkg/Task/Sign`,
    postTaskUnsign: `${baseURL}/CommPkg/Task/Unsign`,

    //PUNCH
    getPunchList: `${baseURL}/CommPkg/PunchList`,
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

export const server = setupServer(
    //General
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

    // Task
    rest.get(ENDPOINTS.getTasks, (_, response, context) => {
        return response(
            context.json(objectToCamelCase(dummyTasksResponse)),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTask, (_, response, context) => {
        return response(context.json(dummyTaskResponse), context.status(200));
    }),
    rest.get(ENDPOINTS.getTaskAttachments, (_, response, context) => {
        return response(
            context.json(dummyAttachmentsResponse),
            context.status(200)
        );
    }),
    rest.get(ENDPOINTS.getTaskAttachment, (_, response, context) => {
        return response(context.json(new Blob()), context.status(200));
    }),
    rest.get(ENDPOINTS.getTaskParameters, (_, response, context) => {
        return response(
            context.json(dummyTaskParametersResponse),
            context.status(200)
        );
    }),
    rest.put(ENDPOINTS.putTaskComment, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postTaskSign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.post(ENDPOINTS.postTaskUnsign, (_, response, context) => {
        return response(context.status(200));
    }),
    rest.put(ENDPOINTS.putTaskParameter, (_, response, context) => {
        return response(context.status(200));
    }),

    // PUNCH
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

import { IAuthService, IAuthServiceProps } from '../authService';
import { AccountInfo } from '@azure/msal-browser';

const authService = ({ MSAL, scopes }: IAuthServiceProps): IAuthService => {
    const login = async (): Promise<void> => {
        return Promise.resolve();
    };
    const getCurrentUser = (): AccountInfo | null => {
        const account: AccountInfo = MSAL.getAllAccounts()[0];
        if (!account) return null;
        return account;
    };
    const logout = async (): Promise<void> => {
        return Promise.resolve();
    };

    const getUserName = (): string => {
        return 'dummy-user';
    };

    const getAccessToken = (): Promise<string> => {
        return Promise.resolve('dummy-bearer-token');
    };

    const isLoggedIn = async (): Promise<boolean> => {
        return true;
    };

    const handleLogin = async (): Promise<boolean> => {
        return Promise.resolve(false);
    };
    return {
        logout,
        handleLogin,
        isLoggedIn,
        getAccessToken,
        getUserName,
        login,
        getCurrentUser,
    };
};

export default authService;

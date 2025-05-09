import { get } from 'http';
import axios from './AxiosConfig';
import { log } from 'console';

interface UserData {
    username: string;
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    isSocialLogin?: boolean;
}

interface Credentials {
    emailOrUsername: string;
    password: string;
}

// Function to get the authorization header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};


// Account Services

export const RegisterService = async (userData: any) => {
    try {
        const response = await axios.post('/Account/Register', userData);
        return response.data;
    } catch (error) {
        return (error as any).response.data;
    }
};


export const ConfirmEmailService = async (token: string, email: string) => {
    try {
        const response = await axios.post('/Account/ConfirmEmail', { token, email });
        return response.data;
    } catch (error) {
        return (error as any).response.data;
    }
};

export const LoginService = async (credentials: Credentials) => {
    return (await axios.post('/Account/Login', credentials)).data;
};

export const LogoutService = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
};

// Password Services
export const ForgotPasswordService = async (email: string) => {
    try {
        const response = await axios.post('/Account/ForgotPassword', { email });
        console.log(response.data);  // Kiểm tra dữ liệu trả về
        return response;  // Trả về response thành công
    } catch (error) {
        console.log(error);
    }
};


export const ChangePasswordService = async (currentPassword: string, newPassword: string) => {
    return await axios.post('/Account/ChangePassword', { currentPassword, newPassword }, getAuthHeader());
};

export const EnabledTwoFactorVerificationService = async () => {
    return await axios.get('/Account/Enable2FA', getAuthHeader());
};

export const VerifyCodeService = async (verifyCode: string) => {
    return await axios.post('/Account/Verify2FA', { verifyCode }, getAuthHeader());
};

export const DisableTwoFactorVerificationService = async () => {
    return await axios.get('/Account/Disable2FA', getAuthHeader());
}
export const GetTwoFAStatusService = async () => {
    return await axios.get('/Account/TwoFAStatus', getAuthHeader());
}
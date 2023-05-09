import { SECURITY_QUESTIONS } from './const';

export type Object = { [key: string]: any };

export type Request = {
    endpoint: string;
    path: string;
    method: string;
    body?: Object;
    query?: Object;
};

export type Sort = {
    sortBy?: string;
    orderBy?: string;
};

export interface ListWalletsCriteria extends Sort {
    name?: string;
    description?: string;
    status?: string;
    favorite?: boolean;
}

export interface ListAddressesCriteria extends Sort {
    chain?: string;
    status?: string;
    addressIds?: string;
}

export interface GenerateAddressesOptions extends Object {
    alias?: string;
    num?: number;
}

export interface ListTransactionsCriteria extends Sort {
    myActionPendingType?: string;
    txnId?: string;
    refId?: string;
    chain?: string;
    subchain?: string;
    networks?: string;
    assets?: string;
    status?: string;
    walletId?: string;
    accountGrpId?: string;
    sendFroms?: string;
    to?: string;
}

export interface Authorization {
    masterKey: string;
    challenge: string;
    signature: string;
}

export interface ApprovalBody {
    stepId: string;
    action: 'approve' | 'reject';
    authorizations?: Array<Authorization>;
    comment?: string;
}

export interface SetPinBody {
    requestId: string;
    otp: string;
    pin: string;
    username: string;
    masterKey: string;
    securityAnswer?: string;
    securityQuestion?: keyof typeof SECURITY_QUESTIONS;
}

export interface RequestOtpQuery {
    projectId: string;
    type: string | number;
    requestId: string;
    externalUserId: string;
    username: string;
    [key: string]: any;
}

export interface SignData {
    from: string;
    chainId: number;
    method?: string;
    data: string;
    type: '0' | '2' | '9999' | 0 | 2 | 9999;
}
export interface Transaction extends SignData {
    to: string;
    gas?: string;
    gasLimit?: string | number;
    gasPrice?: number;
    maxFeePerGas?: number;
    maxPriorityFeePerGas?: number;
    nonce: number;
    value: number;
}

export interface CapturePinResponse {
    status: string;
    requestId: string;
    projectId: string;
    username: string;
    appName: string;
    imageUrl: string;
    chainImage: string;
    txnId?: string;
    address?: string;
}

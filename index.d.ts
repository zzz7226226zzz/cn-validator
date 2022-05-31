declare interface licenseInfo {
    adminDep: string
    orgType: string
    adminArea: string
    orgIdCode: string
    verifyCode: string
}

declare interface license {
    isValid(code: string): boolean
    getInfo(code: string): licenseInfo
    makeId(): string
    makeId(nums: number): string[]
}

declare interface orgLicenseCode {
    isValid(orgCode: string): boolean
}

declare interface personInfo {
    address: string
    birthday: string
    sex: string
    sexTxt: string
    age: string
}

declare interface personID {
    isValid(code: string): boolean
    getInfo(code: string): personInfo
    makeId(): string
    makeId(nums: number): string[]
}

export default class cnValidator {
    constructor()
    license: license
    orgLicenseCode: orgLicenseCode
    personID: personID
}
export declare class CreateUserDto {
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly confirmPassword: string;
    readonly nickname: string;
    readonly phoneNumber: string;
    gender: 'M' | 'F';
    birth: Date;
}

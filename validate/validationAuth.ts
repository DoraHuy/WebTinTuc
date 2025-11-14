import z from "zod";

// Register 
export const RegisterBody = z.object({
    taiKhoan: z.string().min(3, { message: "Tài khoản cần tối thiểu 3 ký tự" }).max(256, { message: "Tài khoản có tối đa 256 ký tự" }),
    email: z.email({ message: "Email không hợp lệ" }),
    password: z.string().min(6, { message: "Mật khẩu có ít nhất là 6 ký tự" }).max(100, { message: "Mật khẩu có tối đa là 100 ký tự" }),
    confirmPassword: z.string().min(6, { message: "Mật khẩu có ít nhất là 6 ký tự" }).max(100, { message: "Mật khẩu có tối đa là 100 ký tự" }),
}).strict().superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Mật khẩu và Nhập lại mật khẩu không giống nhau",
            path: ["confirmPassword"]
        });
    }
})
export type RegisterBodyType = z.infer<typeof RegisterBody>


// Login 
export const LoginBody = z.object({
    taiKhoan: z.string().min(3, { message: "Tài khoản cần tối thiểu 3 ký tự" }).max(256, { message: "Tài khoản có tối đa 256 ký tự" }),
    password: z.string().min(6, { message: "Mật khẩu có ít nhất là 6 ký tự" }).max(100, { message: "Mật khẩu có tối đa là 100 ký tự" })
})
export type LoginBodyType = z.infer<typeof LoginBody>
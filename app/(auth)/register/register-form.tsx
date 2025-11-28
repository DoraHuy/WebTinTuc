'use client'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterBody, RegisterBodyType } from "@/validate/validationAuth"
import { useState } from "react"
import { useRouter } from "next/navigation"


const RegisterForm = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            taiKhoan: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: RegisterBodyType) {
        setLoading(true)
        setError(null)
        try {
            // (auth) là group segment -> URL thực tế: /api/register
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
            let data: any = null
            const ct = res.headers.get('content-type') || ''
            if (ct.includes('application/json')) {
                data = await res.json()
            } else {
                const text = await res.text()
                if (!res.ok) throw new Error(text || 'Đăng ký thất bại')
            }
            if (!res.ok) {
                throw new Error(data?.error || 'Đăng ký thất bại')
            }
            // Thành công: chuyển sang trang đăng nhập
            router.push('/login')
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Có lỗi xảy ra')
        } finally {
            setLoading(false)
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Tài khoản  */}
                <FormField
                    control={form.control}
                    name="taiKhoan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tài khoản</FormLabel>
                            <FormControl>
                                <Input placeholder="Tài khoản" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* email  */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* password  */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input placeholder="Mật khẩu" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* confirm password  */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <FormControl>
                                <Input placeholder="Xác nhận mật khẩu" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        {error}
                    </div>
                )}
                <Button type="submit" disabled={loading} className="bg-[#967f59] w-full hover:bg-[#70562c]">
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
            </form>
        </Form>
    )
}

export default RegisterForm

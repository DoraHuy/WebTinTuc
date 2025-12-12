'use client'
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginBody, LoginBodyType } from "@/validate/validationAuth"

const LoginForm = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            taiKhoan: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginBodyType) {
        setIsLoading(true)
        setError("")
        
        try {
            // (auth) là group segment -> URL thực tế: /api/login
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại')
            }

            // Đăng nhập thành công
            router.push('/')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* email  */}
                <FormField
                    control={form.control}
                    name="taiKhoan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tài khoản</FormLabel>
                            <FormControl>
                                <Input placeholder="Tài khoản" type="text" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                        {error}
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="bg-[#967f59] w-full hover:bg-[#70562c]"
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>

                <div className="flex items-center justify-between text-sm">
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Chưa có tài khoản?
                    </Link>
                    <Link href="/forgot-password" className="text-blue-500 hover:underline">
                        Quên mật khẩu?
                    </Link>
                </div>
            </form>
        </Form>
    )
}

export default LoginForm

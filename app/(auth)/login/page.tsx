import LoginForm from "@/app/(auth)/login/login-form"
import Image from "next/image"


const LoginPage = () => {
    return (
        <>
            <div className="register flex w-screen h-screen bg-[#9079547d] text-white">
                <div className="regiger__left w-[60%] flex flex-col justify-center gap-2 ">
                    <h2 className='text-left text-4xl ml-8 capitalize text-shadow-2xs italic'>Chào mừng đến với Web Tin tức công nghệ</h2>
                    <Image src={"/images/hinh-anh-web-2.jpg"} alt='hình ảnh web' width={300} height={300} quality={100} className='w-[80%] border-4 rounded-2xl shadow-2xl border-[#614a2547] h-auto mx-auto mt-2'></Image>
                </div>

                <div className='flex flex-col gap-5 w-[40%] h-[95%] my-auto justify-start items-center bg-[#bcac93] rounded-2xl px-10 text-white'>
                    <Image src={"/images/logo2.jpg"} alt='Logo web' width={450} height={450} className='w-[80%] h-auto mt-4 rounded-2xl' />

                    <div className='flex flex-col w-full gap-4 justify-center'>
                        <h2 className='text-3xl font-bold text-center'>Đăng Nhập</h2>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage

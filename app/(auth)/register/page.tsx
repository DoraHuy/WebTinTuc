import RegisterForm from "@/app/(auth)/register/register-form"
import Image from "next/image"


const RegisterPage = () => {
    return (
        <>
            <div className="register flex w-screen h-screen bg-[#9079547d] text-white py-3">
                <div className="regiger__left w-[60%] flex flex-col justify-center gap-2 ">
                    <h2 className='text-left text-4xl ml-8 capitalize text-shadow-2xs italic'>Chào mừng đến với Web Tin tức anime</h2>
                    <Image src={"/images/hinh-anh-web-2.jpg"} alt='hình ảnh web' width={300} height={300} quality={100} className='w-[80%] border-4 rounded-2xl shadow-2xl border-[#614a2547] h-auto mx-auto mt-2'></Image>
                </div>

                <div className='flex flex-col gap-3 w-[40%] h-full justify-start items-center bg-[#bcac93] rounded-2xl px-10 text-white'>
                    <Image src={"/images/logo2.jpg"} alt='Logo web' width={450} height={450} className='w-[80%] h-auto mt-4 rounded-2xl' />

                    <div className='flex flex-col w-full'>
                        <h2 className='text-3xl font-bold text-center'>Đăng ký</h2>
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterPage

'use client'

import Header from "@/app/manage/(wrapper-sidebar)/Header";
import { Sidebar } from "@/app/manage/(wrapper-sidebar)/Sidebar/Sidebar";
import { useState } from "react";

export default function WrapperSidebar({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isToggle, setIsToggle] = useState(false);

    const toggleSidebar = () => {
        setIsToggle(!isToggle);
    }

    return (
        <>
            <div className="flex w-full h-screen">
                <Sidebar isCollapsed={isToggle} />
                <div className="flex-1 flex flex-col">
                    <Header onToggleMenu={toggleSidebar} />
                    <main className="flex-1 overflow-y-auto p-4">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}

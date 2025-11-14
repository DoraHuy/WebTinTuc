import WrapperSidebar from "@/app/manage/(wrapper-sidebar)/Wrapper";


export default function ManageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <WrapperSidebar>
            {children}
        </WrapperSidebar>
    );
}
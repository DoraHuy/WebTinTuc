import { BreadcrumForm } from "@/components/BreadcrumbForm"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"

interface ToggleSidebar {
    onToggleMenu: () => void;
}

const Header = ({ onToggleMenu }: ToggleSidebar) => {
    return (
        <>
            <header className="px-3 py-3 shadow-xl w-full">
                <div className="container flex justify-between items-center w-full">

                    {/* left  */}
                    <div className="flex gap-4 items-center">
                        <Button variant={"outline"} onClick={onToggleMenu}><Menu className="w-5 h-5" /></Button>
                        <div>
                            <h2>Quản lý bài viết</h2>
                            <BreadcrumForm />
                        </div>
                    </div>

                    {/* right  */}
                    <div className="flex gap-4">
                        <ModeToggle />
                        <Button><User className="w-5 h-5" /></Button>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header

import { DropdownCategoryPost } from '@/app/manage/posts/DropdownCategoryPost'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

interface Posts {
    id: number,
    tenTinTuc: string,
    tomTat: string,
    thoiGianDang: string,
    nguoiDung: { tenNguoiDung: string },
    danhMuc: { id: number, tenDanhMuc: string }[]
}

type PostsProps = {
    data: Posts[]
}

const PostQuery = ({ data }: PostsProps) => {
    return (
        <div className='flex justify-between'>
            {/* left Post query  */}
            <div className='flex gap-2'>
                <Input placeholder='Bài viết, danh mục' className='w-[250px] h-[30px]' />
                <Button className=' h-[30px]'>Tìm kiếm</Button>
            </div>

            {/* right Post query */}
            <div className='flex gap-2 justify-center items-center'>
                <DropdownCategoryPost />
                <Button className='h-[30px]'><Plus />Thêm mới</Button>
            </div>
        </div>
    )
}

export default PostQuery

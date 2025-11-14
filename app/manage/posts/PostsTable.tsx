'use client'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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

const PostsTable = ({ data }: PostsProps) => {

    return (
        <Table className="table-fixed">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">STT</TableHead>
                    <TableHead>Tên bài viết</TableHead>
                    <TableHead className="w-[300px]">Tóm tắt nội dung</TableHead>
                    <TableHead>Ngày đăng</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((post, index) => (
                    <TableRow key={post.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{post.tenTinTuc}</TableCell>
                        <TableCell className="w-[300px] truncate overflow-hidden whitespace-nowrap">{post.tomTat}</TableCell>
                        <TableCell> {new Date(post.thoiGianDang).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{post.nguoiDung.tenNguoiDung}</TableCell>
                        <TableCell>{post.danhMuc.map(dm => dm.tenDanhMuc).join(', ')}</TableCell>
                        <TableCell className=" flex gap-2 justify-center">
                            <Button className="px-2 py-0.5 w-[45px] h-[30px]">Sửa</Button>
                            <Button className="px-2 py-0.5 w-[45px] h-[30px]">Xóa</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default PostsTable

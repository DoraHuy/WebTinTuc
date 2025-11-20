import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface NewsCardProps {
  id: number
  tenTinTuc: string
  tomTat: string | null
  thoiGianDang: Date
  nguoiDung: {
    tenNguoiDung: string
  }
  danhMuc: {
    id: number
    tenDanhMuc: string
  }[]
}

export function NewsCard({ id, tenTinTuc, tomTat, thoiGianDang, nguoiDung, danhMuc }: NewsCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          {danhMuc.slice(0, 3).map((dm) => (
            <Badge key={dm.id} variant="secondary">
              {dm.tenDanhMuc}
            </Badge>
          ))}
        </div>
        <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
          {tenTinTuc}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {tomTat || "Không có tóm tắt"}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{nguoiDung.tenNguoiDung}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(thoiGianDang), "dd/MM/yyyy", { locale: vi })}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

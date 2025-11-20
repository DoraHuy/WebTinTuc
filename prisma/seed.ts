import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // Đọc file JSON
  const seedDataPath = path.join(__dirname, 'seed-data.json');
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

  // 1. Tạo Vai trò
  console.log('📝 Tạo vai trò...');
  const vaiTroMap: { [key: string]: number } = {};
  for (const vt of seedData.vaiTros) {
    const vaiTro = await prisma.vaiTros.upsert({
      where: { tenVaiTro: vt.tenVaiTro },
      update: {},
      create: {
        tenVaiTro: vt.tenVaiTro,
        moTaVaiTro: vt.moTaVaiTro,
      },
    });
    vaiTroMap[vt.tenVaiTro] = vaiTro.id;
    console.log(`✓ Tạo vai trò: ${vt.tenVaiTro}`);
  }

  // 2. Tạo Permissions
  console.log('📝 Tạo permissions...');
  const permissionMap: { [key: string]: number } = {};
  for (const perm of seedData.permissions) {
    const permission = await prisma.permisions.upsert({
      where: { tenPermision: perm.tenPermision },
      update: {},
      create: {
        tenPermision: perm.tenPermision,
        moTa: perm.moTa,
      },
    });
    permissionMap[perm.tenPermision] = permission.id;
    console.log(`✓ Tạo permission: ${perm.tenPermision}`);
  }

  // 3. Gán permissions cho vai trò
  console.log('📝 Gán permissions cho vai trò...');
  const now = new Date();
  
  // Admin có tất cả permissions
  for (const permKey of Object.keys(permissionMap)) {
    await prisma.vaiTroPermision.upsert({
      where: {
        maVaiTro_maPermision: {
          maVaiTro: vaiTroMap['Admin'],
          maPermision: permissionMap[permKey],
        },
      },
      update: {},
      create: {
        maVaiTro: vaiTroMap['Admin'],
        maPermision: permissionMap[permKey],
        ngayNhan: now,
        trangThai: true,
      },
    });
  }

  // Editor có quyền create, edit, approve post và manage categories
  const editorPerms = ['create_post', 'edit_post', 'approve_post', 'manage_categories'];
  for (const permKey of editorPerms) {
    await prisma.vaiTroPermision.upsert({
      where: {
        maVaiTro_maPermision: {
          maVaiTro: vaiTroMap['Editor'],
          maPermision: permissionMap[permKey],
        },
      },
      update: {},
      create: {
        maVaiTro: vaiTroMap['Editor'],
        maPermision: permissionMap[permKey],
        ngayNhan: now,
        trangThai: true,
      },
    });
  }

  // Author chỉ có quyền create và edit post
  const authorPerms = ['create_post', 'edit_post'];
  for (const permKey of authorPerms) {
    await prisma.vaiTroPermision.upsert({
      where: {
        maVaiTro_maPermision: {
          maVaiTro: vaiTroMap['Author'],
          maPermision: permissionMap[permKey],
        },
      },
      update: {},
      create: {
        maVaiTro: vaiTroMap['Author'],
        maPermision: permissionMap[permKey],
        ngayNhan: now,
        trangThai: true,
      },
    });
  }

  // 4. Tạo Danh mục
  console.log('📝 Tạo danh mục...');
  const danhMucMap: { [key: string]: number } = {};
  
  async function createDanhMuc(dm: any, parentId: number | null = null) {
    const danhMuc = await prisma.danhMucs.upsert({
      where: { tenDanhMuc: dm.tenDanhMuc },
      update: {},
      create: {
        tenDanhMuc: dm.tenDanhMuc,
        moTaDanhMuc: dm.moTaDanhMuc,
        parentId: parentId,
      },
    });
    danhMucMap[dm.tenDanhMuc] = danhMuc.id;
    console.log(`✓ Tạo danh mục: ${dm.tenDanhMuc}`);

    if (dm.children && dm.children.length > 0) {
      for (const child of dm.children) {
        await createDanhMuc(child, danhMuc.id);
      }
    }
  }

  for (const dm of seedData.danhMucs) {
    await createDanhMuc(dm);
  }

  // 5. Tạo Tags
  console.log('📝 Tạo tags...');
  const tagMap: { [key: string]: number } = {};
  for (const tag of seedData.tags) {
    const createdTag = await prisma.tags.create({
      data: {
        tenTag: tag.tenTag,
      },
    });
    tagMap[tag.tenTag] = createdTag.id;
    console.log(`✓ Tạo tag: ${tag.tenTag}`);
  }

  // 6. Tạo Tài khoản và Người dùng
  console.log('📝 Tạo tài khoản và người dùng...');
  const nguoiDungMap: { [key: string]: number } = {};
  
  for (const tk of seedData.taiKhoans) {
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(tk.matKhau, 10);
    
    // Tạo tài khoản
    const taiKhoan = await prisma.taiKhoan.upsert({
      where: { taiKhoan: tk.taiKhoan },
      update: {},
      create: {
        taiKhoan: tk.taiKhoan,
        matKhau: hashedPassword,
      },
    });

    // Tạo người dùng
    const nguoiDung = await prisma.nguoiDungs.upsert({
      where: { tk: tk.taiKhoan },
      update: {},
      create: {
        tenNguoiDung: tk.nguoiDung.tenNguoiDung,
        email: tk.nguoiDung.email,
        SDT: tk.nguoiDung.SDT,
        diaChi: tk.nguoiDung.diaChi,
        gioiTinh: tk.nguoiDung.gioiTinh,
        tk: tk.taiKhoan,
      },
    });
    nguoiDungMap[tk.taiKhoan] = nguoiDung.id;

    // Gán vai trò
    await prisma.nguoiDungVaiTro.upsert({
      where: {
        maNguoiDung_maVaiTro: {
          maNguoiDung: nguoiDung.id,
          maVaiTro: vaiTroMap[tk.vaiTro],
        },
      },
      update: {},
      create: {
        maNguoiDung: nguoiDung.id,
        maVaiTro: vaiTroMap[tk.vaiTro],
        ngayNhan: now,
        trangThai: true,
      },
    });

    console.log(`✓ Tạo tài khoản: ${tk.taiKhoan} (${tk.vaiTro})`);
  }

  // 7. Tạo Tin tức
  console.log('📝 Tạo tin tức...');
  for (const tt of seedData.tinTucs) {
    const tinTuc = await prisma.tinTucs.create({
      data: {
        tenTinTuc: tt.tenTinTuc,
        noiDungTinTuc: tt.noiDungTinTuc,
        tomTat: tt.tomTat,
        trangThaiDuyet: tt.trangThaiDuyet,
        maNguoiDung: nguoiDungMap[tt.author],
        danhMuc: {
          connect: tt.danhMucs.map((dmName: string) => ({ id: danhMucMap[dmName] })),
        },
        tags: {
          connect: tt.tags.map((tagName: string) => ({ id: tagMap[tagName] })),
        },
      },
    });
    console.log(`✓ Tạo tin tức: ${tt.tenTinTuc}`);
  }

  console.log('✅ Seed dữ liệu hoàn tất!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

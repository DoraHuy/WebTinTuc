import { PrismaClient } from '../lib/generated/prisma/index.js';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu từ JSON...');

  // Đọc file JSON từ public/data
  const jsonPath = path.join(__dirname, '..', 'public', 'data', 'homepage-data.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  // 1. Xóa dữ liệu cũ
  console.log('🗑️ Xóa dữ liệu cũ...');
  await prisma.binhLuans.deleteMany();
  await prisma.tinTucs.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.danhMucs.deleteMany();
  await prisma.nguoiDungVaiTro.deleteMany();
  await prisma.nguoiDungs.deleteMany();
  await prisma.taiKhoan.deleteMany();
  await prisma.vaiTroPermision.deleteMany();
  await prisma.vaiTros.deleteMany();
  await prisma.permisions.deleteMany();

  // 2. Tạo vai trò
  console.log('📝 Tạo vai trò...');
  const adminRole = await prisma.vaiTros.create({
    data: { tenVaiTro: 'Admin', moTaVaiTro: 'Quản trị viên' }
  });
  const editorRole = await prisma.vaiTros.create({
    data: { tenVaiTro: 'Editor', moTaVaiTro: 'Biên tập viên' }
  });
  const authorRole = await prisma.vaiTros.create({
    data: { tenVaiTro: 'Author', moTaVaiTro: 'Tác giả' }
  });

  // 3. Tạo danh mục từ JSON
  console.log('📝 Tạo danh mục...');
  const categoryMap: { [key: string]: number } = {};
  for (const cat of jsonData.categories) {
    const category = await prisma.danhMucs.create({
      data: {
        tenDanhMuc: cat.tenDanhMuc,
        moTaDanhMuc: cat.moTaDanhMuc,
      }
    });
    categoryMap[cat.tenDanhMuc] = category.id;
    console.log(`✓ Tạo danh mục: ${cat.tenDanhMuc}`);
  }

  // 4. Tạo tags từ JSON
  console.log('📝 Tạo tags...');
  const tagMap: { [key: string]: number } = {};
  for (const tag of jsonData.tags) {
    const createdTag = await prisma.tags.create({
      data: { tenTag: tag.tenTag }
    });
    tagMap[tag.tenTag] = createdTag.id;
    console.log(`✓ Tạo tag: ${tag.tenTag}`);
  }

  // 5. Tạo tài khoản và người dùng từ JSON authors
  console.log('📝 Tạo tài khoản người dùng...');
  const userMap: { [key: number]: number } = {};
  
  for (const author of jsonData.authors) {
    const username = author.email.split('@')[0];
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Tạo tài khoản
    const taiKhoan = await prisma.taiKhoan.create({
      data: {
        taiKhoan: username,
        matKhau: hashedPassword,
      }
    });

    // Tạo người dùng
    const nguoiDung = await prisma.nguoiDungs.create({
      data: {
        tenNguoiDung: author.tenNguoiDung,
        email: author.email,
        tk: username,
      }
    });

    userMap[author.id] = nguoiDung.id;

    // Gán vai trò Author
    await prisma.nguoiDungVaiTro.create({
      data: {
        maNguoiDung: nguoiDung.id,
        maVaiTro: authorRole.id,
        ngayNhan: new Date(),
        trangThai: true,
      }
    });

    console.log(`✓ Tạo người dùng: ${author.tenNguoiDung}`);
  }

  // 6. Tạo bài viết từ JSON
  console.log('📝 Tạo bài viết...');
  for (const post of jsonData.posts) {
    // Tìm category IDs
    const categoryIds = post.category 
      ? [categoryMap[post.category]]
      : post.categoryIds?.map((id: number) => {
          const catName = jsonData.categories.find((c: any) => c.id === id)?.tenDanhMuc;
          return categoryMap[catName];
        }).filter(Boolean) || [];

    // Tìm tag IDs
    const tagIds = post.tagIds?.map((id: number) => {
      const tagName = jsonData.tags.find((t: any) => t.id === id)?.tenTag;
      return tagMap[tagName];
    }).filter(Boolean) || [];

    const tinTuc = await prisma.tinTucs.create({
      data: {
        tenTinTuc: post.tenTinTuc || post.title,
        noiDungTinTuc: post.noiDungTinTuc || post.content || '<p>Nội dung bài viết</p>',
        tomTat: post.tomTat || post.excerpt,
        trangThaiDuyet: true,
        ngayDang: post.ngayDang ? new Date(post.ngayDang) : new Date(),
        maNguoiDung: userMap[post.authorId],
        danhMuc: {
          connect: categoryIds.map((id: number) => ({ id }))
        },
        tags: {
          connect: tagIds.map((id: number) => ({ id }))
        }
      }
    });

    console.log(`✓ Tạo bài viết: ${post.tenTinTuc || post.title}`);
  }

  console.log('✅ Seed dữ liệu hoàn tất!');
  console.log(`📊 Tổng kết:`);
  console.log(`   - ${jsonData.categories.length} danh mục`);
  console.log(`   - ${jsonData.tags.length} tags`);
  console.log(`   - ${jsonData.authors.length} người dùng`);
  console.log(`   - ${jsonData.posts.length} bài viết`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

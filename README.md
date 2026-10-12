# Barod - Ứng dụng Quản lý Tài chính & Chi tiêu Cá nhân

<div align="center">
  <img alt="Barod Logo" src="budget/assets/icon/icon.png" width="140px">
  <h3><b>Barod</b> - Làm chủ tài chính thông minh, tinh tế và riêng tư</h3>

  [![Flutter](https://img.shields.io/badge/Flutter-3.3+-02569B?logo=flutter&logoColor=white)](https://flutter.dev)
  [![Dart](https://img.shields.io/badge/Dart-3.0+-0175C2?logo=dart&logoColor=white)](https://dart.dev)
  [![SQLite](https://img.shields.io/badge/Database-Drift%20SQLite-003B57?logo=sqlite&logoColor=white)](https://drift.simonbinder.eu)
  [![Landing Page](https://img.shields.io/badge/Website-Landing%20Page-38B374?logo=googlechrome&logoColor=white)](https://duybao105.github.io/expensive_app/)
  [![Release](https://img.shields.io/badge/Release-v5.4.3%20APK-brightgreen?logo=android&logoColor=white)](https://github.com/DuyBao105/expensive_app/releases/tag/v5.4.3)
</div>

---

## 🌐 Trải nghiệm & Tải về

- 🌍 **Trang giới thiệu trực tuyến (Landing Page)**: [https://expensiveapp-website.vercel.app/)
- 📱 **Tải trực tiếp bản cài đặt Android**: [Tải Barod v5.4.3 APK](https://github.com/DuyBao105/expensive_app/releases/download/v5.4.3/barod-app-v5.4.3.apk) *(Dung lượng ~216 MB, tương thích Android 5.0+)*

---

## 📌 Giới thiệu

**Barod** là ứng dụng quản lý chi tiêu và ngân sách cá nhân toàn diện, hiện đại và bảo mật. Được xây dựng trên nền tảng **Flutter** với cơ sở dữ liệu **Drift (SQLite)** cục bộ và giao diện Material You cao cấp.

- **Tác giả**: Bảo Trần Duy
- **Liên hệ / Hỗ trợ**: baotranduy666666@gmail.com
- **Ngôn ngữ mặc định**: Tiếng Việt 100%

---

## ✨ Tính năng nổi bật

- 📊 **Theo dõi thu chi trực quan**: Ghi chép giao dịch tức thì, phân loại theo danh mục với hệ thống biểu đồ thông minh.
- 💰 **Quản lý ngân sách (Budgets)**: Thiết lập hạn mức chi tiêu theo tuần, tháng hoặc chu kỳ tùy chỉnh; cảnh báo khi sắp vượt ngưỡng.
- 🎯 **Mục tiêu tích lũy (Savings Goals)**: Theo dõi tiến độ tiết kiệm cho các dự định tương lai.
- 💳 **Đa ví & Đa tài khoản**: Quản lý nhiều tài khoản ngân hàng, tiền mặt, ví điện tử với tỷ giá ngoại tệ tự động cập nhật.
- 🔒 **Bảo mật & Riêng tư**: Dữ liệu lưu trữ hoàn toàn trên thiết bị của bạn, hỗ trợ sao lưu mã hóa lên Google Drive cá nhân.
- 🎨 **Giao diện hiện đại**: Hỗ trợ Dark Mode, Dynamic Color (Material You), màu chủ đề xanh ngọc (`#37E58C`) tinh tế.

---

## 🚀 Hướng dẫn khởi chạy mã nguồn

### Yêu cầu hệ thống:
- Flutter SDK (>= 3.3.0)
- Dart SDK (>= 3.0.0)

### Cài đặt và chạy ứng dụng:

1. Di chuyển vào thư mục ứng dụng:
   ```bash
   cd budget
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   flutter pub get
   ```

3. Cấu hình Firebase (tùy chọn):
   - Đổi tên file `lib/firebase_options.example.dart` thành `lib/firebase_options.dart` và điền thông tin dự án Firebase của bạn (hoặc chạy lệnh `flutterfire configure`).

4. Chạy ứng dụng:
   - **Trên trình duyệt Edge / Chrome**:
     ```bash
     flutter run -d edge
     # hoặc
     flutter run -d chrome
     ```
   - **Trên thiết bị Android / Giả lập**:
     ```bash
     flutter run -d android
     ```

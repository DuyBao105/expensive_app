@echo off
title Khoi dong May Ao Barod (Pixel 4)
chcp 65001 >nul
echo ===================================================
echo     DANG KHOI DONG MAY AO ANDROID CHO BAROD...
echo ===================================================
echo.
echo 1. Dang mo cua so dien thoai Pixel 4 len man hinh...
start "" "C:\Users\ADMIN\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Pixel_4_API_35

echo 2. Dang cho may ao ket noi ADB...
"C:\Users\ADMIN\AppData\Local\Android\Sdk\platform-tools\adb.exe" wait-for-device

echo 3. Dang cap nhat ban APK moi nhat (Khong chu DEBUG + Du lieu mau)...
"C:\Users\ADMIN\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r "c:\Games\Cashew-main\budget\build\app\outputs\flutter-apk\app-debug.apk"

echo 4. Dang tu dong khoi chay ung dung Barod...
timeout /t 3 /nobreak >nul
"C:\Users\ADMIN\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell monkey -p com.budget.tracker_app -c android.intent.category.LAUNCHER 1

echo.
echo ===================================================
echo     DA MO THANH CONG! BAN CO THE CHUP MAN HINH CHO CV.
echo ===================================================
pause

# Tu Tiên — Thôn Khởi Nguyên · 0.6

Game khám phá 2D top-down trên trình duyệt, dùng toàn bộ tài nguyên nội bộ. Không có dependency hoặc bước build.

## Chạy

`npm start` chạy Python 3 HTTP server tại cổng 8080, chỉ bind loopback. Mở trang bằng trình duyệt trên máy đang chạy server. Muốn chơi trên điện thoại, chép bộ tệp tới một máy chủ web mà điện thoại truy cập được; cần cấu hình địa chỉ lắng nghe và tường lửa phù hợp. Cũng có thể mở `index.html` trực tiếp trên trình duyệt hỗ trợ tệp cục bộ. Chưa đóng gói Android/iOS và chưa có PWA/cache offline cho trang truy cập qua mạng.

## Map mới

`assets/thon-khoi-nguyen.png` là ảnh nền gốc 1536×1024, dựng thành thế giới 2304×1536 (diện tích thế giới bằng 2,25 lần bản 0.5), tạo cho dự án bằng công cụ sinh ảnh, lấy cảm hứng từ ảnh thôn được cung cấp. Cảnh mới có đường đất rộng, sân giữa thôn thoáng, hai nhà phụ phía bắc và nhánh bãi cỏ phía đông nam. Đường chính rộng khoảng 165–189 đơn vị thế giới, so với khoảng 58–70 ở bản trước. Kiến trúc, sông, cầu và vườn được bố trí lại để bớt chật. Ánh sáng chiều dịu, màu xanh rêu và đường đất trầm thay cho màu vàng/xanh chói. Map hiện dùng ảnh nền vẽ sẵn; **không còn là terrain ghép từ bộ tile 32×32 của bản 0.4**. Nhân vật vẫn dùng sprite gốc 32×32, bốn hướng, ba tư thế mỗi hướng; hiển thị nguyên pixel, không làm mịn.

Menu ☰ có thanh **Độ sáng cảnh** từ 60% đến 110%, mặc định 92%. Tùy chọn lưu riêng trên thiết bị và áp dụng cho cả cảnh chơi lẫn bản đồ tổng quan. Lớp ảnh đã chỉnh màu được lưu đệm, không chạy bộ lọc lại mỗi frame. HUD và nhân vật giữ độ rõ.

`world.js` định nghĩa các hành lang đi được theo lối mòn trên chính ảnh này, sân trống, vị trí nhà và chướng ngại vật. Nhà, giếng, mặt nước và rừng dày không đi xuyên được. Cảnh nền là một lớp phẳng; chưa có hệ thống tách lớp tán cây/mái nhà cho che khuất nhân vật. Muốn chỉnh cảnh bằng tile editor trong tương lai cần chuyển artwork thành tileset/layer riêng.

Điểm bắt đầu và hồi sinh ở vòng ngọc giữa sân thôn `(1044, 711)`. Menu ☰ → **Về điểm hồi sinh** quay về đó và giữ tiến độ. Chưa có hệ thống sinh tử; `respawn()` sẵn cho việc tích hợp sau. Save có phiên bản bản đồ; save của phiên bản map cũ đưa vị trí về sân mới, giữ các địa điểm đã khám phá để tránh mất tiến độ hoặc khôi phục vào vật cản.

Nút **Bản đồ** mở toàn cảnh cùng dấu vị trí nhân vật; đóng bằng × hoặc Escape. Nhân vật dừng di chuyển khi mở bản đồ.

## Điều khiển

- WASD / mũi tên: di chuyển; Shift: chạy.
- E / nút tương tác: nói chuyện khi đứng gần trưởng thôn; E/Enter đóng hội thoại.
- Điện thoại: kéo cần điều khiển cảm ứng.
- 1–6: hiệu ứng kỹ năng; Space: vung kiếm hoặc tương tác. Chưa gây sát thương.
- T / Tu luyện / Đả tọa: hiệu ứng tĩnh tâm, kết thúc khi di chuyển.
- Menu ☰: chỉ dẫn, âm thanh, toàn màn hình, bản đồ và quay về điểm hồi sinh.

Bốn địa điểm khám phá: nhà trưởng thôn, dược đường, tiệm rèn, cây cổ thụ. Vị trí và tiến độ lưu bằng localStorage. Thanh chỉ số hiện là giá trị khởi đầu, chưa có tăng cấp, túi đồ hay chiến đấu.

## Kiểm tra

`npm test`: 8 kiểm tra gồm vị trí bắt đầu/địa điểm, vật cản, đường kết nối tới tất cả địa điểm/cổng/cầu, nước/rừng, sân hồi sinh, cầu cong tọa độ ngoài biên, kích thước thế giới và bề rộng đường chính. `node --check game.js` kiểm tra cú pháp.

Đã kiểm tra bằng Chromium: tải artwork cục bộ, WASD, hội thoại, hồi sinh, lưu/tải lại, mở/đóng bản đồ, tạm dừng khi xem bản đồ và sự kiện cảm ứng thực qua CDP trên viewport điện thoại. Đã kiểm tra thêm mặc định độ sáng, thay đổi thực tế của pixel cảnh, điều khiển slider bằng bàn phím, lưu độ sáng sau reload và giữ tiến độ cũ khi chuyển map. Không có request tới tài nguyên bên ngoài. Chưa kiểm tra trên điện thoại vật lý.

Ảnh hiện tại: `docs/map-illustrated-desktop.png`, `docs/map-illustrated-mobile.png`, `docs/map-overview.png`. Ảnh `map-32px.png` và `assets/tileset-32.png` lưu bản thiết kế 0.4 trước đó, không đại diện map mới.

## Cấu trúc

`world.js`: tọa độ và va chạm. `scenery.js`: nạp/vẽ artwork cục bộ. `tiles.js`: tạo sprite nhân vật 32px và tileset cũ. `game.js`: camera, input, nhân vật, hiệu ứng, hội thoại, lưu và bản đồ tổng quan. `index.html` / `style.css`: HUD responsive.

# Tu Tiên — Thôn Khởi Nguyên

Bản khám phá offline 2D top-down trong kho mới `tutien23`.

## Bản đồ khởi đầu

Dùng đúng artwork đã có trong dự án và khớp ảnh tham khảo: đại sảnh phía bắc, sân đá tròn ở giữa, dược đường phía tây, tiệm rèn phía đông, nhà dân, ruộng vườn, cầu gỗ, suối và cổng phía nam. Bản này không sinh lại tranh mới: bỏ các lớp ghép sân/nhà lúc chạy để giữ đúng bố cục mẫu.

- Ảnh nguồn: [assets/images/thon-khoi-nguyen.png](assets/images/thon-khoi-nguyen.png), 1536×1024.
- Thế giới chơi: 2304×1536; vị trí khởi đầu/hồi sinh `(1044, 711)` tại tâm sân tròn.
- Cảnh chơi và bản đồ tổng quan dùng cùng ảnh nguồn và cùng mức chỉnh sáng, không thay nhà hoặc xóa hàng rào trong lúc nạp.
- Save trước phiên bản map7 đưa vị trí về sân mới, giữ các địa điểm đã khám phá. Save phiên bản7 tiếp tục lưu/tải vị trí bình thường.
- Tên trong nhiệm vụ, hội thoại, HUD, tiêu đề và bản đồ là **Thôn Khởi Nguyên**.
- Tùy chọn độ sáng và thu phóng hiện có vẫn lưu trên thiết bị.

## Ảnh thực tế

[Toàn cảnh bản đồ](assets/images/thon-khoi-nguyen-overview.png) · [Trong game](assets/images/thon-khoi-nguyen-gameplay.png) · [Điện thoại](assets/images/thon-khoi-nguyen-mobile.png) · [Bản đồ trên điện thoại](assets/images/thon-khoi-nguyen-mobile-overview.png).

Các PNG được chụp từ bản game đang chạy, không phải ảnh minh họa thay gameplay.

## Chạy và điều khiển

`npm start`, rồi mở `http://127.0.0.1:8080`. Bản game không cần build hoặc thư viện ngoài lúc chơi. Để tải về chơi, cần toàn bộ tệp HTML/CSS/JS và thư mục `assets`, không chỉ riêng HTML. `preview.html` dùng cùng nguồn với `index.html`.

- WASD / mũi tên: đi, Shift: chạy; điện thoại dùng joystick.
- E: trò chuyện với trưởng thôn; Space: tương tác hoặc vung kiếm.
- Nút **Bản đồ**: toàn cảnh và vị trí hiện tại; × / Escape để đóng. Nhân vật dừng khi xem bản đồ.
- Menu ☰ → **Về điểm hồi sinh** đưa về sân giữa thôn, giữ tiến độ.
- 1–6: hiệu ứng kỹ năng; T: đả tọa.

## Kiểm tra

- `npm test`: 10 kiểm tra vị trí, vật cản, lối đi nối các điểm khám phá, cổng, cầu và cửa nhà.
- `npm ci`, rồi `npm run test:browser`: kiểm tra Chromium và lưu lại 4 PNG. Mặc định dùng `/usr/bin/chromium`; đặt `CHROMIUM_PATH` nếu trình duyệt ở vị trí khác.
- Kiểm tra trình duyệt bao gồm chuyển save cũ sang sân mới nhưng giữ khám phá, đi bộ, mở/đóng bản đồ, dừng di chuyển khi xem bản đồ, dùng đúng artwork, hồi sinh, tải lại save và cảm ứng joystick qua CDP trên viewport điện thoại. Chưa thử trên điện thoại vật lý.

## Phạm vi hiện tại

Artwork là một tranh nền, không phải tilemap nhiều lớp có thể chỉnh từng viên. Va chạm dùng hành lang và footprint được khai báo trong `world.js`; chưa tách tán cây/mái nhà để che nhân vật theo chiều sâu. Có NPC trưởng thôn, động vật, khám phá và lưu vị trí. Kỹ năng hiện chỉ là hiệu ứng; chưa có chiến đấu, tăng cấp, máy chủ hoặc nhiều người chơi thật.

`world.js`: bố cục, điểm bắt đầu, va chạm. `scenery.js`: nạp/vẽ một artwork và cache chỉnh sáng. `game.js`: input, camera, lưu, hội thoại, tổng quan. `tiles.js`: sprite nhân vật và tileset cũ. `wildlife.js`: động vật. `assets/tileset-32.png` và ảnh cũ dưới `docs/` là lịch sử, không phải bản đồ hiện tại.

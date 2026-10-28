# Tu Tiên — Thôn Khởi Nguyên 0.7 · Map C
Game HTML5 Canvas 2D top-down, tài nguyên nội bộ, không cần build, chưa có multiplayer.

## Chạy
`npm start` để chạy máy chủ cục bộ trên cổng 8080, mở bằng trình duyệt. `npm test` chạy các kiểm tra đường đi và va chạm. Có thể đưa toàn bộ tệp lên GitHub Pages để chơi trực tuyến.

## Thay đổi của map 0.7
- Thay một ảnh nền cố định bằng đồ họa dạng lớp dựng từ tile, đường đất, sân làng, nhà, sông, cầu, cây và tiểu cảnh. Các đường đi được dựng từ cùng dữ liệu `world.js` dùng kiểm tra va chạm.
- Khoảng cách nhà rộng hơn, sân trung tâm rõ và thoáng. Nhân vật/NPC vẫn là sprite 32px gốc.
- `wildlife.js`: chim bay ngang trời, gà/mèo/chó đi ngẫu nhiên; khi người chơi tới gần chúng chạy tránh và sau đó trở về trạng thái bình thường.
- Canvas căn theo tỷ lệ điểm ảnh màn hình và camera zoom hợp lý thay vì vẽ ở nửa độ phân giải rồi kéo giãn, giảm cảm giác mờ.
- Lớp tiền cảnh riêng; overview map được tạo từ nền đang chơi.
- Giữ nguyên menu, tiến độ khám phá 4 địa điểm, lưu localStorage, joystick Android, kỹ năng giả lập.

Tệp bản đồ cũ `assets/thon-khoi-nguyen.png` được giữ để tham khảo; phiên bản mới không sử dụng ảnh này. Bốn cổng chỉ là mốc cảnh quan, chưa có teleport/map 2. Chưa có AI chiến đấu hay multiplayer.

## File chính
`index.html`, `style.css`, `world.js` (tọa độ/va chạm), `tiles.js` (sprite), `scenery.js` (nền và vật thể), `wildlife.js` (thú), `game.js` (camera, input, render, HUD), `tests/world.test.cjs`.

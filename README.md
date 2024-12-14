# Ứng dụng Thiệp Giáng Sinh

Ứng dụng web cho phép người dùng tạo và chia sẻ thiệp Giáng sinh với hiệu ứng đẹp mắt và tính năng gợi ý lời chúc từ AI.

## Tính năng

- Tạo thiệp Giáng sinh với giao diện tương tác
- Hiệu ứng cây thông 3D với đèn nhấp nháy
- Gợi ý lời chúc tự động bằng AI (OpenAI GPT-4)
- Tùy chỉnh link thiệp
- Xem trước thiệp realtime
- Chia sẻ thiệp qua link

## Cài đặt

1. Clone repository và di chuyển vào thư mục dự án

2. Cài đặt dependencies:
   - npm install

3. Tạo file môi trường:
   - Copy file .env.example thành .env
   - Cập nhật API key OpenAI trong file .env

4. Tạo thư mục database:
   - Tạo thư mục db trong thư mục gốc

## Chạy ứng dụng

Development:
- npm run dev

Production:
- npm start

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Công nghệ sử dụng

- Node.js
- Express
- SQLite3
- EJS
- OpenAI API
- HTML5/CSS3
- JavaScript

## Đóng góp

Mọi đóng góp đều được chào đón. Vui lòng tạo issue hoặc pull request.

## License

MIT

## Author

Kha Dang with ❤️

[LinkedIn](https://www.linkedin.com/in/khadnh/)
export function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-gray-50 py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} NovelReader. Nền tảng đọc truyện chữ online tối ưu trải nghiệm.
                </p>
                <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
                    <a href="#" className="hover:text-gray-900">Điều khoản</a>
                    <a href="#" className="hover:text-gray-900">Chính sách bảo mật</a>
                    <a href="#" className="hover:text-gray-900">Liên hệ</a>
                </div>
            </div>
        </footer>
    );
}

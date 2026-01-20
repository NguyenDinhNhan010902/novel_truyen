export interface Chapter {
    id: string;
    novelId: string;
    title: string;
    order: number;
    content: string; // HTML string
    updatedAt: string;
}

const SAMPLE_CONTENT = `
<p>Thiên địa bất nhân, dĩ vạn vật vi sô cẩu!</p>
<p>Gió lạnh thổi qua đỉnh núi trọc, cuốn theo những bông tuyết trắng xóa bay múa đầy trời. Một thân ảnh cô độc đứng lặng lẽ bên vách đá, ánh mắt xa xăm nhìn về phía chân trời mờ mịt.</p>
<p>"Đã ba ngàn năm rồi..." - Hắn khẽ thở dài, hơi thở hóa thành làn khói trắng tan biến vào hư không.</p>
<p>Hắn tên là Lâm Phong, vốn là một thanh niên bình thường ở thế kỷ 21, nhưng trong một lần leo núi gặp tai nạn, hắn đã xuyên không đến thế giới tu chân tàn khốc này.</p>
<p>Ở đây, cường giả vi tôn, kẻ yếu chỉ như sâu kiến. Lâm Phong từ một phế vật ngũ hành tạp linh căn, trải qua bao nhiêu sinh tử kiếp nạn, cuối cùng cũng bước lên con đường nghịch thiên cải mệnh.</p>
<p>Nhưng cái giá phải trả là quá lớn. Gia tộc bị diệt, người yêu vì hắn mà chết, huynh đệ phản bội... Giờ đây, đứng trên đỉnh cao của tu vi, hắn lại cảm thấy cô đơn đến tột cùng.</p>
<p>"Nếu có thể làm lại, ta có chọn con đường này không?"</p>
<p>Câu hỏi này đã dằn vặt hắn suốt trăm năm qua. Nhưng hắn biết, trên đời này không có thuốc hối hận. Tu tiên là con đường không lối về, một khi đã bước chân vào, chỉ có thể tiến về phía trước, hoặc là chết.</p>
<p>Bỗng nhiên, bầu trời tối sầm lại, sấm chớp ầm ầm. Một luồng uy áp khủng khiếp từ trên cao giáng xuống, khiến cả ngọn núi rung chuyển dữ dội.</p>
<p>"Lâm Phong! Ngươi dám nghịch thiên hành sự, hôm nay Bản toạ thay trời hành đạo!" - Một giọng nói uy nghiêm vang vọng khắp đất trời.</p>
<p>Lâm Phong ngẩng đầu lên, khóe miệng nhếch lên một nụ cười ngạo nghễ. Trong tay hắn xuất hiện một thanh trường kiếm rỉ sét, nhưng lại tỏa ra kiếm ý kinh người.</p>
<p>"Ông trời? Nếu trời muốn diệt ta, ta sẽ nghịch cả trời!"</p>
<p>Dứt lời, hắn vung kiếm chém mạnh về phía bầu trời. Một đạo kiếm quang rực rỡ xé toạc màn đêm, lao thẳng về phía lôi kiếp đang tụ tập...</p>
<br/>
<p><i>(Hết chương 1)</i></p>
`;

export const MOCK_CHAPTERS: Chapter[] = [];

import React from 'react';
import { Button } from 'react-bootstrap';

const MainContentAccount: React.FC = () => {
    return (
        <div className="p-3 bg-light rounded">
            <h2 className="h5">Lịch sử đơn hàng</h2>
            <p>Đơn hàng của bạn</p>
            <p className="text-muted">Bạn chưa có đơn hàng nào mua tại website Coolmate.me</p>
            <Button variant="dark" className="mt-3">CHÍNH SÁCH ĐỔI TRẢ 60 NGÀY</Button>
        </div>
    );
};

export default MainContentAccount;
